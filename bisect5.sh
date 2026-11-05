#!/bin/bash
L=$1
sed -n "1,$((L-1))p" src/features/ngaji-ceria/pages/quiz/DuelLobbyPage.tsx > one.tsx
tail -n +$((L+1)) src/features/ngaji-ceria/pages/quiz/DuelLobbyPage.tsx >> one.tsx
python3 -c "
import json
c=json.load(open('/tmp/opencode/tsc.json'))
c['files']=['one.tsx']
open('/tmp/opencode/tsc.json','w').write(json.dumps(c))
"
/home/albet-surya-kembara/Documents/productivity/projects/sabil/tartila/node_modules/.bin/tsc -p /tmp/opencode/tsc.json --ignoreDeprecations 6.0 2>&1 | head -1
