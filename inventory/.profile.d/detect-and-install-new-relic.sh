#!/bin/bash
####################################################################################################################
#####################################################################################################################
##  detect-and-install-new-relic.sh
##  ©Copyright IBM Corporation 2016
##  Written by Hans Kristian Moen September 2016
##
##  Script does three things:
##  1. Looks for New Relic license key in bound services and copy them to NEW_RELIC_LICENSE_KEY if exists
##  2. If New Relic license key is present and agent is not installed, run nmp install
##  3. If New Relic license key is present and no agent config file is installed, sets NEW_RELIC_NO_CONFIG_FILE
##
##  NOTE: After Cloud Foundry v238, this functionality should be moved from .profile.d/ into .profile 
##
##  LICENSE: MIT (http://opensource.org/licenses/MIT) 
##
#####################################################################################################################
###################################################################################################################

NPM_BIN=${HOME}/vendor/node/bin/npm 

# Only check for license key in VCAP_SERVICES if they have not been passed in through CloudFoundry manifest.yaml or set-env
if [[ -z $NEW_RELIC_LICENSE_KEY ]] 
then
  echo "Checking for New Relic license key in bound services"
  ## Check if we have bound to a brokered New Relic service
  LICENSE_KEY=$(echo  "${VCAP_SERVICES}" | jq --raw-output ".newrelic[0].credentials.licenseKey")

  ## Allow user-provided-services to overwrite brokered services, if they exist
  UP_LICENSE_KEY=$(echo "${VCAP_SERVICES}" | jq --raw-output  '.["user-provided"] | .[] | select(.name == "newrelic") | .credentials.licenseKey' 2>/dev/null )
  if [[ "$UP_LICENSE_KEY" != "null" ]] && [[ ! -z $UP_LICENSE_KEY ]]
  then
    echo "License Key found in User Provided Service: ${UP_LICENSE_KEY}"
    LICENSE_KEY=$UP_LICENSE_KEY
  fi
  
  if [[ ! -z $LICENSE_KEY ]] && [[ "${LICENSE_KEY}" != "null" ]]
  then
    echo "Found bound New Relic service instance"
    export NEW_RELIC_LICENSE_KEY=$LICENSE_KEY
  fi
fi

# If we have a New Relic License Key, check if NewRelic agent is installed
if [[ ! -z $NEW_RELIC_LICENSE_KEY ]]
then
  echo "Found New Relic license Key"
  ## Check if module is supplied
  if [[ ! -d ${HOME}/node_modules/newrelic ]]
  then
    echo "Couldn't find newrelic agent installed. Installing latest version"
    OLD_PWD=${PWD}
    cd ${HOME}
    $NPM_BIN install newrelic
    cd $OLD_PWD
  fi
else
  echo "No New Relic license key found"
fi

# Check if we have the necessary new relic configuration
if [[ ! -z $NEW_RELIC_LICENSE_KEY ]] && [[ ! -f ${HOME}/newrelic.js ]] && [[ -z $NEW_RELIC_NO_CONFIG_FILE ]];
then
  echo "Couldn't find a NewRelic config file. Setting NEW_RELIC_NO_CONFIG_FILE=True so agent can start"
  export NEW_RELIC_NO_CONFIG_FILE="True"
  ## Create the file
  #touch app/newrelic.js

  # If we don't have a config file, we must set the application name in env variable
  if [[ -z $NEW_RELIC_APP_NAME ]]
  then
    ## Get application name from Cloud Foundry (could also be gotten from package.json)
    APP_NAME=$(echo $VCAP_APPLICATION | jq --raw-output '.name')
    export NEW_RELIC_APP_NAME=$APP_NAME
    echo "Setting New Relic appname to ${APP_NAME}"
  fi
fi

