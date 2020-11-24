# https://www.reddit.com/dev/api/oauth#GET_subreddits_mine_{subscriber | contributer | moderator | streams}
# TODO: what URI to redirect to once we have permissions
# TODO: pass a random string, it can also include instructions for what to do next
# Can add y'all as developers to the 'grok.date' (q5rIR3lqrwMirg) reddit app

# 1. To ask for user permission, send to
#  https://www.reddit.com/api/v1/authorize?client_id=q5rIR3lqrwMirg&response_type=code&state=RANDOM_STRING&redirect_uri=URI&duration=temporary&scope=mysubreddits
#  - TODO: what URI to redirect to? set state string (random and/or track state)
# 2. Parse the error, state, and code parameters from the redirect URI once the user gives permission & is redirected
# 3. make POST request with code to https://www.reddit.com/api/v1/access_token (if no error & same state).
#    include grant_type=authorization_code&code=CODE&redirect_uri=URI in the POST data (NOT in URL)
# 4. Get access token from request. It expires in an hour. Can now make API requests by including the following in HTTP request headers
#    Authorization: bearer TOKEN
# 5. When done with token, make POST to url https://www.reddit.com/api/v1/revoke_token with `token=TOKEN&token_type_hint=TOKEN_TYPE` in the data

# We can requ   est data without a client token too using 'Application ONly OAuth'

import requests
import webbrowser
import json
from datetime import datetime

def print_field(dictionary, key):
    if key in dictionary and dictionary[key] is not None and dictionary[key] != "":
        print(f"{key.upper():24}{dictionary[key]}")
        return True
    return False
        

def print_url(dictionary, key):
    if key in dictionary and dictionary[key] is not None:
        dictionary[key] = dictionary[key].split("?")[0]
        return print_field(dictionary, key)
    return False

def print_subreddit_infos(subreddits):
    for subreddit in subreddits:
        data = subreddit["data"]
        # SUMMARY
        print("="*100)
        print(f"LINK:\thttp://www.reddit.com/{data['display_name_prefixed']}")
        print_field(data, "display_name_prefixed")
        print_field(data, "title")
        print_field(data, "public_description")
        print_field(data, "subscribers")
        # # User info
        print_field(data, "user_has_favorited")
        print_field(data, "user_is_subscriber")
        print_field(data, "user_is_moderator")
        print_field(data, "user_is_contributor")
        print_field(data, "user_is_banned")
        print_field(data, "user_is_muted")
        # Images
        print_url(data, "community_icon")           # community icon (1)
        print_url(data, "icon_img")                 # community icon (2)
        print_url(data, "header_img")               # community icon (3) old reddit, low res, maybe unused
        print_url(data, "banner_background_image")  # banner image (1)
        # Colors
        print_field(data, "banner_background_color")    # color of banner       #33a8ff default
        print_field(data, "primary_color")              # color of widgets      #0079D3 default
        print_field(data, "key_color")                  # old theme color       #24a0ed default?
        # Useful
        print_field(data, "subreddit_type")
        print_field(data, "id")
        print_field(data, "name")

APP_ID = 'q5rIR3lqrwMirg'
APP_SECRET = 'r3ClSlbfmhiI2hYF05GAAqN8CU0jsg'
APP_NAME = 'grok.date'
APP_DEV = 'darcipeeps'
APP_REDIRECT = 'http://localhost:3000'

GET_NEW_TOKEN = False

if GET_NEW_TOKEN:
    # Open browser to get uesr permission
    webbrowser.open(f'https://www.reddit.com/api/v1/authorize?client_id={APP_ID}&response_type=code&state=RANDOM_STRING&redirect_uri={APP_REDIRECT}&duration=temporary&scope=mysubreddits read')
    # e.g. 'GET /?state=RANDOM_STRING&code=3EHPUdjREkgq74_1AQZNbqR16v6yPA HTTP/1.1' 200 -

    # The code returned to our local server
    CODE = input("Code:")

    base_url = 'https://www.reddit.com/'
    data = {
        'grant_type': 'authorization_code', 
        'code': CODE,
        'redirect_uri': APP_REDIRECT,
    }

    auth = requests.auth.HTTPBasicAuth(APP_ID, APP_SECRET)
    resp = requests.post(
            base_url + 'api/v1/access_token',
            data=data,
            headers={'user-agent': f'{APP_NAME} by {APP_DEV}'},
            auth=auth
        )
    d = resp.json()
    print(d)
    print(f"access_token = \"{d['access_token']}\"")
    TOKEN = 'bearer ' + d['access_token']
    exit(1)
else:
    access_token = "7730963168-z8c__x_mSN8tAEAQsiWGdL1HTu0lzA"
    TOKEN = 'bearer ' + access_token

base_url = 'https://oauth.reddit.com'

headers = {'Authorization': TOKEN, 'User-Agent': f'{APP_NAME} by {APP_DEV}'}
resp = requests.get(base_url + '/subreddits/mine/subscriber', headers=headers)

if resp.status_code == 200:
    with open("_temp_response.json", "w+") as f:
        f.write(json.dumps(resp.json()))
        subreddits = resp.json()["data"]["children"]
        print_subreddit_infos(subreddits)

# Get info about just one subreddit
# base_url = 'https://oauth.reddit.com'
# headers = {'Authorization': TOKEN, 'User-Agent': f'{APP_NAME} by {APP_DEV}'}
# resp = requests.get(base_url + '/r/UIUC/about', headers=headers)
# if resp.status_code == 200:
#     with open("_temp_response_UIUC.json", "w+") as f:
#         f.write(json.dumps(resp.json()))