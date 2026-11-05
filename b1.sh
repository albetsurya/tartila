#!/bin/bash
L=$1
sed -n "1,$((L-1))p" PATTERN/features/ngaji-ceria/pages/quiz/DuelLobbyPage.tsx > one.tsx
tail -n +$((L+1)) PATTERN/ngaji-ceria/pages/quiz/DuelLobbyPage.tsx >> one.tsx
python3 -c "
import json
c=json.load(open('tsc.json'))
c['files']=['one.tsx']
open('tsc.json','w').write(json.dumps(c))
"
/home/albet-surya-kembara/Documents/productivity/projects/sabil/tartila/node_modules/.bin/tsc -p tsc.json 2>&1 | head -1
