# Builds the git commit message for the automated "refresh training dates" run.
#
# Invocation (see .github/workflows/refresh-trainings.yml):
#
#   jq -n -r --arg today "$(date -u +%Y-%m-%d)" \
#      --slurpfile old /tmp/old.json \
#      --slurpfile new /tmp/new.json \
#      -f .github/trainings-commit-message.jq
#
# `today` is passed in and `now` is never called here, so the tests can pin the
# date: the ended/removed split below is a comparison against "today" and would
# otherwise be untestable.
#
# Dates are matched by `id` across all courses; a date that moves from one course
# to another would read as removed + added, which is the honest description.

# Upstream computes `pricing`, `credits`, `few_seats` and the early-bird block
# against ITS build date, so they change on their own as time passes (an expired
# early bird disappears from the feed entirely). Comparing them would report
# phantom edits, so they are dropped before diffing and the underlying `price`,
# `credit_points` and `seats_limited` are reported instead.
# In the live feed the early bird sits at `price.early_bird`, not at the top
# level - both paths are dropped so either shape stays quiet.
def undecorated:
  delpaths([["pricing"], ["credits"], ["few_seats"], ["early_bird"], ["price", "early_bird"]]);

# A city or course title carrying a newline would break the one-line-per-event
# body, so every value that reaches the output goes through here first.
def clean:
  if . == null then ""
  else tostring
    | gsub("[[:space:]]+"; " ")
    | sub("^ +"; "")
    | sub(" +$"; "")
  end;

def trunc($n):
  if (length > $n) then (.[0:$n - 1] | sub(" +$"; "")) + "…" else . end;

def pad($n):
  if (length < $n) then . + (" " * ($n - length)) else . end;

def dates_of($payload):
  [ $payload.courses[]?
    | . as $course
    | ($course.dates[]? | select(type == "object" and .id != null))
    | { id: (.id | tostring),
        course: (($course.short_title // $course.title // $course.id) | clean),
        d: . } ];

def by_id:
  reduce .[] as $entry ({}; .[$entry.id] = $entry);

# Fields whose change is worth naming, most newsworthy first; everything else
# sorts after them alphabetically so the output stays deterministic.
def field_order:
  ["status", "seats_limited", "start", "end", "city", "country", "price", "format", "language", "trainers"];

def changed_fields($x; $y):
  [ (($x | keys) + ($y | keys)) | unique | .[] | select($x[.] != $y[.]) ]
  | sort_by(. as $f | [(field_order | index($f)) // 99, $f]);

def phrase($field; $x; $y):
  if $field == "seats_limited" then
    (if $y.seats_limited == true then "few seats left" else "no longer short of seats" end)
  elif $field == "status" then "status " + ($y.status | clean | trunc(20))
  elif $field == "start" then "moved to " + ($y.start | clean | trunc(20))
  elif $field == "end" then "now ends " + ($y.end | clean | trunc(20))
  elif $field == "city" then
    (if ($y.city | clean) == "" then "city dropped" else "now in " + ($y.city | clean | trunc(30)) end)
  elif $field == "format" then "format now " + ($y.format | clean | trunc(20))
  elif $field == "language" then "language now " + ($y.language | clean | trunc(20))
  elif $field == "price" then
    (if ($y.price.amount != null and $x.price.amount != $y.price.amount)
     then "price now " + ($y.price.amount | tostring) + " " + (($y.price.currency // "EUR") | clean | trunc(8))
     else "price changed" end)
  elif $field == "trainers" then "trainers changed"
  else ($field | clean | trunc(20)) + " changed"
  end;

def code_of($entry): (($entry.d.code // $entry.id) | clean | trunc(40));

def place_of($d):
  if ($d.format // "") == "online" then "online"
  else (($d.city // $d.country // "t.b.d.") | clean | trunc(30))
  end;

# More than three changes at once is a rewrite, not an edit; listing them all
# would bury the interesting ones.
def summary_of($event):
  if ($event.changes | length) > 3
  then (($event.changes | length) | tostring) + " fields changed"
  else ($event.changes | join(", "))
  end;

def line_of($event):
  "- " + ($event.kind | pad(9)) + code_of($event.entry) + " (" + $event.entry.id + ")"
  + (if $event.kind == "added" then
       ", " + ($event.entry.d.start | clean) + " to " + ($event.entry.d.end | clean)
       + ", " + place_of($event.entry.d) + ", " + ($event.entry.d.language | clean)
     elif $event.kind == "updated" then ": " + summary_of($event)
     elif $event.kind == "ended" then " — past"
     else ""
     end);

def subject_of($event):
  if $event.kind == "added" then
    "chore: new date " + code_of($event.entry) + ", " + ($event.entry.d.start | clean)
  elif $event.kind == "updated" then
    "chore: " + code_of($event.entry) + " — " + summary_of($event)
  elif $event.kind == "removed" then
    "chore: " + code_of($event.entry) + " withdrawn"
  else
    "chore: " + code_of($event.entry) + " has ended"
  end;

($old[0] // {}) as $o
| ($new[0] // {}) as $n
| (dates_of($o)) as $old_dates
| (dates_of($n)) as $new_dates
| ($old_dates | by_id) as $old_by_id
| ($new_dates | by_id) as $new_by_id
| [ $new_dates[] | select($old_by_id[.id] == null) | {kind: "added", entry: ., changes: []} ] as $added
| [ $new_dates[]
    | . as $entry
    | ($old_by_id[$entry.id]) as $before
    | select($before != null)
    | ($before.d | undecorated) as $x
    | ($entry.d | undecorated) as $y
    | select($x != $y)
    | {kind: "updated", entry: $entry, changes: [changed_fields($x; $y)[] | phrase(.; $x; $y)]} ] as $updated
| [ $old_dates[] | select($new_by_id[.id] == null) ] as $gone
# A date vanishes for two completely different reasons: the workflow's expiry
# filter dropped it because it is over (routine), or somebody withdrew it
# upstream while it was still to come (news). The end date is what tells them
# apart, and calling the first one "removed" would read like a cancellation.
| [ $gone[] | select((.d.end // "9999-12-31") >= $today) | {kind: "removed", entry: ., changes: []} ] as $removed
| [ $gone[] | select((.d.end // "9999-12-31") < $today) | {kind: "ended", entry: ., changes: []} ] as $ended
| ($added + $updated + $removed + $ended) as $events
| ([ $events[].entry.course | select(. != "") ] | reduce .[] as $c ([]; if index($c) == null then . + [$c] else . end)) as $courses
| (if ($events | length) == 0 then
     "chore: refresh training dates from trainings.arc42.org"
   elif ($events | length) == 1 then
     subject_of($events[0])
   else
     "chore: " + (($events | length) | tostring) + " training changes"
     + (if ($courses | length) > 0 then " (" + ($courses | join(", ")) + ")" else "" end)
   end) as $raw_subject
| ($raw_subject | trunc(72)) as $subject
| if ($events | length) == 0 then $subject
  else $subject + "\n\n" + ([$events[] | line_of(.)] | join("\n"))
  end
