#/bin/bash

vercel link -p prfs-id-webapp --yes
vercel pull --environment=production
vercel build --prod
vercel deploy --prod --prebuilt
