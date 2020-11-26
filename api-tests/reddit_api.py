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
import time
import re

def print_field(dictionary, key):
    if key in dictionary and dictionary[key] is not None and dictionary[key] != "":
        print(f"{key.upper():24}{dictionary[key]}")
        return True
    return False

def print_fields(dictionary, keys):
    for key in keys:
        print_field(dictionary, key)
        
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
        print_fields(data, [
            "display_name_prefixed", "title", "public_description", 
            "subscribers", "user_has_favorited", "user_is_subscriber", 
            "user_is_moderator", "user_is_contributor", "user_is_banned", 
            "user_is_muted", "community_icon", "icon_img", "header_img", 
            "banner_background_image", "banner_background_color", 
            "primary_color", "key_color", "subreddit_type", "id", "name"
        ])

def print_post_infos(posts):
    for post in posts:
        data = post["data"]
        # SUMMARY
        print("="*100)
        print(f"{'LINK':24}http://www.reddit.com{data['permalink']}")
        print_fields(data, [
            "title", "subreddit", "author", "name", "upvote_ratio", "ups", 
            "total_awards_recieved", "created", "num_comments", "url", "stickied"
        ])
        preview = re.sub('\s+', ' ', data['selftext'])[:100]
        if len(data['selftext']) > 100:
            preview += '...'
        print(f"{'SELFTEXT':24}{preview}")

APP_ID = 'q5rIR3lqrwMirg'
APP_SECRET = 'r3ClSlbfmhiI2hYF05GAAqN8CU0jsg'
APP_NAME = 'grok.date'
APP_DEV = 'darcipeeps'
APP_REDIRECT = 'http://localhost:3000'

def getUserToken():
    # Open browser to get user permission
    webbrowser.open(f'https://www.reddit.com/api/v1/authorize?client_id={APP_ID}&response_type=code&state=RANDOM_STRING&redirect_uri={APP_REDIRECT}&duration=temporary&scope=mysubreddits read')
    # e.g. ==> 'GET /?state=RANDOM_STRING&code=3EHPUdjREkgq74_1AQZNbqR16v6yPA HTTP/1.1' 200 -
    # Ask user for the code returned to the local server
    CODE = input("Code:")

    # Get access token using code
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
            headers={'User-Agent': f'{APP_NAME} by u/{APP_DEV}'},
            auth=auth
        )
    d = resp.json()
    return 'bearer ' + d['access_token']

def getAPIToken():
    data = {
        'grant_type': 'client_credentials',
    }
    auth = requests.auth.HTTPBasicAuth(APP_ID, APP_SECRET)
    resp = requests.post(
            'https://www.reddit.com/api/v1/access_token',
            data=data,
            headers={'User-Agent': f'{APP_NAME} by u/{APP_DEV}'},
            auth=auth
        )
    d = resp.json()
    return 'bearer ' + d['access_token']

def fetchUsersSubreddits(token):
    headers = {'Authorization': token, 'User-Agent': f'{APP_NAME} by {APP_DEV}'}
    resp = requests.get('https://oauth.reddit.com/subreddits/mine/subscriber?limit=100', headers=headers)
    if resp.status_code == 200:
        with open("_temp_subscriber.json", "w+") as f:
            f.write(json.dumps(resp.json()))
            subreddits = resp.json()["data"]["children"]
            print_subreddit_infos(subreddits)
            return subreddits
    else:
        print("Error", resp.status_code, resp.text)

def fetchSubredditTopPosts(subreddit, token, limit=1, count=0):
    attempts = 0
    while (True):
        resp = requests.get(
            'https://oauth.reddit.com/r/' + subreddit + '/hot?limit=' + limit + '&g=US&count=' + count, 
            headers = {
                'Authorization': token, 
                'User-Agent': f'{APP_NAME} by u/{APP_DEV}'
            }
        )
        if resp.status_code == 200:
            with open("_temp_top_posts.json", "w+") as f:
                f.write(json.dumps(resp.json()))
            posts = resp.json()["data"]["children"]
            print_post_infos(posts)
            break
        else:
            time.sleep(3)
            print(attempts + ') Failed to get top posts:', resp.status_code, resp.text)
        attempts += 1

def fetchSubredditInfo(subreddit, token):
    resp = requests.get(
        'https://oauth.reddit.com/r/UIUC/about', 
        headers = {
            'Authorization': token, 
            'User-Agent': f'{APP_NAME} by {APP_DEV}'
        }
    )
    if resp.status_code == 200:
        with open("_temp_subreddit_info.json", "w+") as f:
            f.write(json.dumps(resp.json()))

def main():
    GET_USER_TOKEN = False

    if GET_USER_TOKEN:
        token = getUserToken()
    else:
        token = "7730963168-5xjxAFRvSqWbhBCYydDe8Dq7h2KzfQ"

    fetchUsersSubreddits('UIUC', token)

if __name__ == '__main__':
    main()
