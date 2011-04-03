from pymining.segmenter import Segmenter
from pymining.configuration import Configuration

class detect:
    def __init__(self):
        self.cfg = Configuration.FromFile("pymining/conf/test.xml")
        self.segmenter = Segmenter(self.cfg, "segmenter")

    def Split(self, line):
        wordList = self.segmenter.Split(line)
        return wordList
