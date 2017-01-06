# SearchBucket
Google Chrome extension which allows users to search code reviews from specified repositories (update data manually).


## How to update data
Data is stored in json format in the directory specified as resources_dir (ex. "resources/")
To manually update these data:

1. Delete (or move somewhere else) json files in resources_dir
2. In CommentsFromPullRequest.py, Specify the projects you would like to prepare json data with the variable named projects.
3. Run CommentsFromPullRequest.py (python requests module is required: http://docs.python-requests.org/en/master/)
>     python CommentsFromPullRequest.py


## How to use the Chrome extension
After preparing json data in resources_dir, you can try using this Chrome extension.
Follow the link below to load the extension and get started.
https://developer.chrome.com/extensions/getstarted#unpacked


## FAQ
to be updated...
