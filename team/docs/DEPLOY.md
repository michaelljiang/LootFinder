# Deployment

Our Vite + Vue app is deployed through Vercel. However, we were unable to directly link this Github repository for deployment on Vercel due to the fact that this repository is under an organization: ucsb-cs148-w25.

We were able to circumvent this issue by creating a fork of this repo at https://github.com/AjayLiu/pj14-lootfinder-deploy. We then link Vercel's deployment to track the main branch of the fork.

In order to deploy our app, [AjayLiu](https://github.com/ajayliu) simply clicks the Sync Fork button. This will update our fork's main to this repo's main and deploy automatically to https://lootfinder.vercel.app/

<img width="677" alt="image" src="https://github.com/user-attachments/assets/dc91bee0-ce00-4aa2-8553-9eaaaac11108" />
