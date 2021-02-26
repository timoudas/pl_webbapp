
import abc

class Load(metaclass=abc.ABCMeta):
   @abc.abstractmethod
   def load_params(self):
      pass

class Download(metaclass=abc.ABCMeta):
    
   @abc.abstractmethod
   def load_params(self):
      pass


class CLIInterface():

    def __init__(self, )

    def _download(self):
        pass
    
    def _clean(self):
        pass

    def _push_to_db(self):
        pass

    def run(self):
        data = self._download()
        clean_data = _clean(data)
        self._push_to_db(clean_data)
    

    interface = CLIInterface('playerstats')