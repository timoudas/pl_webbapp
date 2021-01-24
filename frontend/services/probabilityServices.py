"""Python sub-proccesses for use in node.js to calculated probabilities

Usage:
  subprocess_cli.py -u [options] <LEAGUE>

Options:
  -s  --shots             Shots Probability
  -p  --passes            Passes Probability

"""

from docopt import docopt
from pprint import pprint
import scipy.stats


def shots_prob(player_dict)
    """Calculate probability of shots, given a mean and std"""
   for key, value in player_dict:
       if key.startswith('avg'):
           scipy.stats.norm(float(key), float(val)) 

def passes_prob(player_dict)
    """Calculate probability of passes, given a mean and std"""
   for key, value in player_dict:
       if key == 'averagePasses':
           avg = float(value)
        if key == 'stdDevPasses':
            std = float(value)
    scipy.stats.norm.sf(value, avg, std)



# if __name__ == '__main__':
#   try:
#       args = docopt(__doc__, version='sub-proccesses v1.0')
#       for key, value in args.items():
#           if value == True:
#               dispatch(key, args['<LEAGUE>'].upper())
#   except Exception as e:
#     print(e)