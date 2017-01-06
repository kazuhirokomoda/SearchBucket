#!/usr/bin/env python
# -*- coding: utf-8 -*-

import sys
import os.path
import getpass
import requests
import json
import codecs
from collections import defaultdict

username = raw_input('your username: ')
password = getpass.getpass()

# TODO: specify
domain = ""
api_url_projects = domain + "rest/api/1.0/projects/"


def slug_repositories(project, limit):
    r = requests.get(api_url_projects + project + "/repos?limit=" + str(limit), auth=(username, password))
    repos = r.json()["values"]
    slug_repos = [repo["slug"] for repo in repos]
    return slug_repos


def output_comments(project, module):

    r = requests.get(api_url_projects + project + "/repos/" + module + "/pull-requests?state=ALL", auth=(username, password))
    pr_count = r.json()["size"]
    print
    print "===========", module, pr_count, "==========="

    pr_url_list = get_pr_url_list(project, module, pr_count)
    pr_comment_list = [get_comment_list(each_pr_url, username, password) for each_pr_url in pr_url_list]

    comment_url_list = comment_and_url(pr_comment_list, project, module)
    # TODO: remove comment out to print results
    #for i in xrange(len(comment_url_list)):
    #    print comment_url_list[i][0][0].encode('utf_8'), comment_url_list[i][0][1]
    return comment_url_list


def get_pr_url_list(project, module, pr_count):
    pr_url_list = []
    for i in xrange(pr_count):
        pr_url_list.append(api_url_projects + project + "/repos/" + module + "/pull-requests/" + str(i+1) + "/activities")
    return pr_url_list


def get_comment_list(url, username, password):
    r = requests.get(url, auth=(username, password))
    activity_list = r.json()["values"]
    return [(activity["comment"]["text"], activity["comment"]["author"]["name"]) for activity in activity_list if activity["action"] == "COMMENTED"]


def flatten_list(a_list):
    if len(a_list) == 0:
        return []
    else:
        return reduce(lambda x,y: x+y, a_list)


def comment_and_url(a_list, project, module):
    if len(a_list) == 0:
        return []
    else:
        return flatten_list([[[elem, domain + "projects/"+project+"/repos/"+module+"/pull-requests/"+str(pair[0]+1)+"/overview"] for elem in pair[1]] for pair in enumerate(a_list)])


if __name__ == '__main__':

    # TODO: specify based on your situations.
    resources_dir = 'resources/'
    projects = []
    limit = 100

    for project in projects:

        modules = slug_repositories(project, limit)
        dd = defaultdict(list)

        for module in modules:
            dd[module] = output_comments(project, module)

        json_file_name = resources_dir + 'modules_' + project + '.json'

        # don't make json file if it already exists
        if os.path.isfile(json_file_name):
            continue

        with codecs.open(json_file_name, 'w', 'utf-8') as f:
            json.dump(dd, f, 
                indent=4,
                ensure_ascii=False,
                sort_keys=True)

