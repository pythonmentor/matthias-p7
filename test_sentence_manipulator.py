#!/usr/bin/env python3
# -*- coding: Utf-8 -*

import pytest
from fr_stop_words import stop_words
import sentence_manipulator as manipulator

class TestSentenceManipulator:

    @classmethod
    def setup_class(cls):
        cls.manip = manipulator.SentenceManipulator()

    #@pytest.mark.parametrize("chaine, result", [
    #    ("Chaïne chaine !", ["chaine", "chaine"]),
    #    ("!Hello Papy, où se trouve la basilique de Fourvière ?",
    #        ["trouve", "basilique", "fourviere"]),
    #    ("stp Grandpy, tu connais ça toi, l'adresse de la tour Crayon à Lyon?",
    #        ["adresse", "tour", "crayon", "lyon"])
    #    ])

    def test_lower_case(self):
        self.manip.question = "Chaïne chaine !"
        assert self.manip.lower_case() == "chaïne chaine !"

    def test_suppress_accents(self):
        self.manip.question = "chaïne chaine !"
        assert self.manip.suppress_accents(self.manip.question) == "chaine chaine !"
        
    def test_suppress_punctuation(self):
        self.manip.question = "chaine chaine !"
        assert self.manip.suppress_punctuation() == "chaine chaine"

    def test_cut_question(self):
        self.manip.question = "chaine chaine !"
        assert self.manip.cut_question() == ['chaine', 'chaine', '!']

    def test_no_stop_words(self):
        self.manip.question = ['chaine', 'chaine']
        for word in self.manip.question :
            assert self.manip.no_stop_words() == ['chaine', 'chaine']
