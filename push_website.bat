@echo off
echo Preparing to upload website files (including APK)...
git add .
git commit -m "Add new apps and mobile layout fixes"
git push
echo Upload Complete!
pause
