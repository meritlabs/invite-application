

while true; do
        read -p "Would you like to deploy to Merit BOT to production? [Y/N]: " yn
        case $yn in
            [Yy]* ) git checkout master && git pull && heroku git:remote -a merit-invite-discord-bot && git push heroku master; break;;
            [Nn]* ) heroku git:remote -a test-merit-invite-discord-bot && echo 'Enter current branch below' && read branch && git push heroku $branch:master; break;;
            * ) echo "Please answer yes or no.";;
        esac
    done