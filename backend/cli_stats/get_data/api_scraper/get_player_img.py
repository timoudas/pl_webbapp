import requests
import shutil
import os

from api_scraper import Football
from bs4 import BeautifulSoup
from pprint import pprint
from pathlib import Path
from directory import Directory

""" from requests_html import HTMLSession """


dirname = os.path.dirname(__file__)
IMG_SAVE_PATH = os.path.join(dirname, '..','..', '..', '..', 'frontend', 'public', 'assets/')



fb = Football()

def get_team_url(teamID):
    url = f"https://www.premierleague.com/clubs/{teamID}/club/squad"
    response = requests.get(url, timeout=(3.05, 5))
    return response


def get_team_ids(season):
    """
        Args:
            season(str): "2019/2020"
    """
    fb.load_leagues()
    fb.leagues['EN_PR'].load_seasons()
    team_keys = fb.leagues['EN_PR'].seasons[season].load_teams().keys()
    team_id = [i for i in team_keys]
    return team_id


def get_player_name(team_request):
    soup = BeautifulSoup(team_request.content, 'html.parser')
    tags_raw = soup.find_all('h4', {'class': 'name'})
    tags = [tag.text for tag in tags_raw]
    return tags

def get_player_pid(team_request):
    player_id = []
    soup = BeautifulSoup(team_request.content, 'lxml')
    for img in soup.select('img.statCardImg'):
        player_id.append(img.get('data-player'))
    return player_id

def create_dict(team_request):
    player_names = get_player_name(team_request)
    player_id = get_player_pid(team_request)
    player_url_tuple = zip(player_names, player_id)
    return player_url_tuple



def all_player_imgs(season):
    team_ids = get_team_ids(season)
    results = []
    for team_id in team_ids:
        team_players = get_team_url(team_id)
        players = create_dict(team_players)
        for player, p_id in players:
            p_dict = {
                'name': player,
                'p_id': p_id
            }
            results.append(p_dict)
    return results


def get_team_names(season):
    team_names = []
    fb.load_leagues()
    fb.leagues['EN_PR'].load_seasons()
    team_values = fb.leagues['EN_PR'].seasons[season].load_teams()
    for value in team_values.values():
        team_names.append(value['shortName'])
    return team_names


def map_player_to_id(season):
    all_players = []
    team_shortNames = get_team_names(season)
    fb.load_leagues()
    fb.leagues['EN_PR'].load_seasons()
    fb.leagues['EN_PR'].seasons[season].load_teams()
    for team_name in team_shortNames:
        players = fb.leagues['EN_PR'].seasons[season].teams[team_name].load_players()
        for key, value in players.items():
            temp_team_dict = {
                    'name': value['name']['display'],
                    'id' : value['id']}
            all_players.append(temp_team_dict)
    return all_players

def merge_id_name(season):
    players = all_player_imgs(season)
    player_ids = map_player_to_id(season)
    fixture_merged = [{**x, **y} for y in player_ids for x in players if x['name'] == y['name']]
    return fixture_merged

def download_images(season):
    all_players = merge_id_name(season)
    all_players = all_players
    for player in all_players:
        print(player)
        p_id = player['p_id']
        player_id = player['id']
        print('Downloading', player_id)
        url = 'https://resources.premierleague.com/premierleague/photos/players/110x140/{}.png'.format(p_id)
        response = requests.get(url)
        if response.status_code == 200:
            with open('{}{}.png'.format(IMG_SAVE_PATH, player_id), 'wb') as f:
                for chunk in response.iter_content(1024):
                    f.write(chunk)
    # print('saved', IMG_SAVE_PATH)

def get_league_imgs():
    seasons = ['274', '79']
    img = []
    for i in seasons:
        print(i)
        url = f'https://www.premierleague.com/tables?co=1&se={i}&ha=-1'
        response = requests.get(url, timeout=(3.05, 5))
        soup = BeautifulSoup(response.content, 'lxml')
        tags_name = soup.find_all('span', {'class': 'short'})
        tags_raw = soup.find_all('img', {'class': 'badge-image badge-image--25 js-badge-image'})
        tup = zip(tags_name, tags_raw)
        for i, v in tup:
            response = requests.get(v['src'])
            if response.status_code == 200:
                with open('{}{}.png'.format(IMG_SAVE_PATH, i.text), 'wb') as f:
                    for chunk in response.iter_content(1024):
                        f.write(chunk)


def download_img(url, text):
    response = requests.get(url)
    if response.status_code == 200:
        with open('{}{}.png'.format(IMG_SAVE_PATH, text), 'wb') as f:
            for chunk in response.iter_content(1024):
                f.write(chunk)

if __name__ == '__main__':
    download_images('2020/2021')

