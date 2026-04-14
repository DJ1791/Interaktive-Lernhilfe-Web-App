import { Crossword } from './index';

export const crosswords: Crossword[] = [
  {
    "id": "cw-kitchen",
    "categoryId": "home",
    "title": "Küche",
    "width": 10,
    "height": 9,
    "grid": [
      [
        null,
        null,
        null,
        null,
        null,
        null,
        {
          "letter": "G",
          "number": 1
        },
        null,
        null,
        null
      ],
      [
        null,
        null,
        null,
        null,
        {
          "letter": "T",
          "number": 2
        },
        null,
        {
          "letter": "A"
        },
        null,
        null,
        null
      ],
      [
        {
          "letter": "M",
          "number": 3
        },
        null,
        null,
        null,
        {
          "letter": "O"
        },
        null,
        {
          "letter": "B",
          "number": 4
        },
        {
          "letter": "R"
        },
        {
          "letter": "O"
        },
        {
          "letter": "T"
        }
      ],
      [
        {
          "letter": "I"
        },
        null,
        {
          "letter": "M",
          "number": 5
        },
        null,
        {
          "letter": "P"
        },
        null,
        {
          "letter": "E"
        },
        null,
        null,
        null
      ],
      [
        {
          "letter": "L",
          "number": 6
        },
        {
          "letter": "O"
        },
        {
          "letter": "E"
        },
        {
          "letter": "F"
        },
        {
          "letter": "F"
        },
        {
          "letter": "E"
        },
        {
          "letter": "L"
        },
        null,
        null,
        null
      ],
      [
        {
          "letter": "C"
        },
        null,
        {
          "letter": "S"
        },
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ],
      [
        {
          "letter": "H"
        },
        null,
        {
          "letter": "S",
          "number": 7
        },
        {
          "letter": "A"
        },
        {
          "letter": "L"
        },
        {
          "letter": "Z"
        },
        null,
        null,
        null,
        null
      ],
      [
        null,
        null,
        {
          "letter": "E"
        },
        null,
        null,
        null,
        null,
        null,
        null,
        null
      ],
      [
        {
          "letter": "H",
          "number": 8
        },
        {
          "letter": "E"
        },
        {
          "letter": "R"
        },
        {
          "letter": "D"
        },
        null,
        null,
        null,
        null,
        null,
        null
      ]
    ],
    "clues": [
      {
        "number": 4,
        "direction": "across",
        "clue": "Aus Mehl gebacken, Frühstück",
        "answer": "BROT",
        "startRow": 2,
        "startCol": 6
      },
      {
        "number": 6,
        "direction": "across",
        "clue": "Man isst damit Suppe",
        "answer": "LOEFFEL",
        "startRow": 4,
        "startCol": 0
      },
      {
        "number": 7,
        "direction": "across",
        "clue": "Weißes Gewürz, macht salzig",
        "answer": "SALZ",
        "startRow": 6,
        "startCol": 2
      },
      {
        "number": 8,
        "direction": "across",
        "clue": "Zum Kochen von heißem Essen",
        "answer": "HERD",
        "startRow": 8,
        "startCol": 0
      },
      {
        "number": 1,
        "direction": "down",
        "clue": "Man isst damit Nudeln",
        "answer": "GABEL",
        "startRow": 0,
        "startCol": 6
      },
      {
        "number": 2,
        "direction": "down",
        "clue": "Man kocht darin Suppe",
        "answer": "TOPF",
        "startRow": 1,
        "startCol": 4
      },
      {
        "number": 3,
        "direction": "down",
        "clue": "Weiße Flüssigkeit von der Kuh",
        "answer": "MILCH",
        "startRow": 2,
        "startCol": 0
      },
      {
        "number": 5,
        "direction": "down",
        "clue": "Man schneidet damit",
        "answer": "MESSER",
        "startRow": 3,
        "startCol": 2
      }
    ]
  },
  {
    "id": "cw-clothing",
    "categoryId": "clothing",
    "title": "Kleidung",
    "width": 9,
    "height": 11,
    "grid": [
      [
        null,
        null,
        null,
        null,
        null,
        {
          "letter": "R",
          "number": 1
        },
        null,
        null,
        null
      ],
      [
        null,
        null,
        null,
        null,
        null,
        {
          "letter": "O"
        },
        null,
        {
          "letter": "M",
          "number": 2
        },
        null
      ],
      [
        null,
        null,
        null,
        null,
        {
          "letter": "S",
          "number": 3
        },
        {
          "letter": "C"
        },
        {
          "letter": "H"
        },
        {
          "letter": "U"
        },
        {
          "letter": "H"
        }
      ],
      [
        null,
        null,
        null,
        null,
        null,
        {
          "letter": "K"
        },
        null,
        {
          "letter": "E"
        },
        null
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        {
          "letter": "T"
        },
        null
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        {
          "letter": "Z"
        },
        null
      ],
      [
        null,
        null,
        null,
        null,
        {
          "letter": "H",
          "number": 4
        },
        {
          "letter": "O"
        },
        {
          "letter": "S",
          "number": 5
        },
        {
          "letter": "E"
        },
        null
      ],
      [
        {
          "letter": "J",
          "number": 6
        },
        {
          "letter": "A"
        },
        {
          "letter": "C"
        },
        {
          "letter": "K"
        },
        {
          "letter": "E"
        },
        null,
        {
          "letter": "C"
        },
        null,
        null
      ],
      [
        null,
        null,
        null,
        null,
        {
          "letter": "M"
        },
        null,
        {
          "letter": "H"
        },
        null,
        null
      ],
      [
        null,
        null,
        null,
        null,
        {
          "letter": "D"
        },
        null,
        {
          "letter": "A"
        },
        null,
        null
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        {
          "letter": "L"
        },
        null,
        null
      ]
    ],
    "clues": [
      {
        "number": 3,
        "direction": "across",
        "clue": "Trägt man am Fuß",
        "answer": "SCHUH",
        "startRow": 2,
        "startCol": 4
      },
      {
        "number": 4,
        "direction": "across",
        "clue": "Trägt man an den Beinen",
        "answer": "HOSE",
        "startRow": 6,
        "startCol": 4
      },
      {
        "number": 6,
        "direction": "across",
        "clue": "Man trägt sie bei Kälte",
        "answer": "JACKE",
        "startRow": 7,
        "startCol": 0
      },
      {
        "number": 1,
        "direction": "down",
        "clue": "Kleidung, die Frauen tragen",
        "answer": "ROCK",
        "startRow": 0,
        "startCol": 5
      },
      {
        "number": 2,
        "direction": "down",
        "clue": "Trägt man auf dem Kopf (Winter)",
        "answer": "MUETZE",
        "startRow": 1,
        "startCol": 7
      },
      {
        "number": 4,
        "direction": "down",
        "clue": "Oberteil mit Knöpfen",
        "answer": "HEMD",
        "startRow": 6,
        "startCol": 4
      },
      {
        "number": 5,
        "direction": "down",
        "clue": "Trägt man um den Hals",
        "answer": "SCHAL",
        "startRow": 6,
        "startCol": 6
      }
    ]
  },
  {
    "id": "cw-body",
    "categoryId": "body",
    "title": "Körper",
    "width": 13,
    "height": 10,
    "grid": [
      [
        null,
        null,
        null,
        null,
        {
          "letter": "K",
          "number": 1
        },
        {
          "letter": "O"
        },
        {
          "letter": "P"
        },
        {
          "letter": "F",
          "number": 2
        },
        null,
        null,
        null,
        null,
        {
          "letter": "N",
          "number": 3
        }
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        {
          "letter": "I"
        },
        null,
        null,
        null,
        null,
        {
          "letter": "A"
        }
      ],
      [
        {
          "letter": "L",
          "number": 4
        },
        {
          "letter": "A"
        },
        {
          "letter": "E"
        },
        {
          "letter": "C"
        },
        {
          "letter": "H"
        },
        {
          "letter": "E"
        },
        {
          "letter": "L"
        },
        {
          "letter": "N"
        },
        null,
        {
          "letter": "H",
          "number": 5
        },
        null,
        null,
        {
          "letter": "S"
        }
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        {
          "letter": "G"
        },
        null,
        {
          "letter": "A",
          "number": 6
        },
        {
          "letter": "U"
        },
        {
          "letter": "G",
          "number": 7
        },
        {
          "letter": "E"
        }
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        {
          "letter": "B",
          "number": 8
        },
        {
          "letter": "E"
        },
        {
          "letter": "I"
        },
        {
          "letter": "N"
        },
        null,
        {
          "letter": "E"
        },
        null
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        {
          "letter": "R"
        },
        null,
        {
          "letter": "D"
        },
        null,
        {
          "letter": "S"
        },
        null
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        {
          "letter": "I"
        },
        null
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        {
          "letter": "C"
        },
        null
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        {
          "letter": "H"
        },
        null
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        {
          "letter": "T"
        },
        null
      ]
    ],
    "clues": [
      {
        "number": 1,
        "direction": "across",
        "clue": "Das oberste Körperteil",
        "answer": "KOPF",
        "startRow": 0,
        "startCol": 4
      },
      {
        "number": 4,
        "direction": "across",
        "clue": "Freundlicher Gesichtsausdruck",
        "answer": "LAECHELN",
        "startRow": 2,
        "startCol": 0
      },
      {
        "number": 6,
        "direction": "across",
        "clue": "Damit sieht man",
        "answer": "AUGE",
        "startRow": 3,
        "startCol": 9
      },
      {
        "number": 8,
        "direction": "across",
        "clue": "Körperteil mit Fuß",
        "answer": "BEIN",
        "startRow": 4,
        "startCol": 6
      },
      {
        "number": 2,
        "direction": "down",
        "clue": "Am Ende der Hand, 5 davon",
        "answer": "FINGER",
        "startRow": 0,
        "startCol": 7
      },
      {
        "number": 3,
        "direction": "down",
        "clue": "Damit riecht man",
        "answer": "NASE",
        "startRow": 0,
        "startCol": 12
      },
      {
        "number": 5,
        "direction": "down",
        "clue": "Am Ende des Armes",
        "answer": "HAND",
        "startRow": 2,
        "startCol": 9
      },
      {
        "number": 7,
        "direction": "down",
        "clue": "Der vordere Teil des Kopfes",
        "answer": "GESICHT",
        "startRow": 3,
        "startCol": 11
      }
    ]
  },
  {
    "id": "cw-work",
    "categoryId": "work",
    "title": "Arbeit",
    "width": 11,
    "height": 7,
    "grid": [
      [
        null,
        null,
        null,
        null,
        {
          "letter": "C",
          "number": 1
        },
        null,
        null,
        null,
        null,
        null,
        null
      ],
      [
        null,
        null,
        {
          "letter": "L",
          "number": 2
        },
        null,
        {
          "letter": "H"
        },
        null,
        null,
        null,
        null,
        null,
        null
      ],
      [
        {
          "letter": "P",
          "number": 3
        },
        {
          "letter": "R"
        },
        {
          "letter": "O"
        },
        {
          "letter": "J"
        },
        {
          "letter": "E"
        },
        {
          "letter": "K"
        },
        {
          "letter": "T",
          "number": 4
        },
        null,
        null,
        {
          "letter": "B",
          "number": 5
        },
        null
      ],
      [
        null,
        null,
        {
          "letter": "H"
        },
        null,
        {
          "letter": "F"
        },
        null,
        {
          "letter": "E"
        },
        null,
        null,
        {
          "letter": "U"
        },
        null
      ],
      [
        null,
        null,
        {
          "letter": "N"
        },
        null,
        null,
        null,
        {
          "letter": "A",
          "number": 6
        },
        {
          "letter": "K"
        },
        {
          "letter": "T"
        },
        {
          "letter": "E"
        },
        null
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        {
          "letter": "M"
        },
        null,
        null,
        {
          "letter": "R"
        },
        null
      ],
      [
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        null,
        {
          "letter": "J",
          "number": 7
        },
        {
          "letter": "O"
        },
        {
          "letter": "B"
        }
      ]
    ],
    "clues": [
      {
        "number": 3,
        "direction": "across",
        "clue": "Eine Aufgabe mit Zielen",
        "answer": "PROJEKT",
        "startRow": 2,
        "startCol": 0
      },
      {
        "number": 6,
        "direction": "across",
        "clue": "Sammlung wichtiger Papiere",
        "answer": "AKTE",
        "startRow": 4,
        "startCol": 6
      },
      {
        "number": 7,
        "direction": "across",
        "clue": "Englisches Wort für Arbeit",
        "answer": "JOB",
        "startRow": 6,
        "startCol": 8
      },
      {
        "number": 1,
        "direction": "down",
        "clue": "Der Boss im Büro",
        "answer": "CHEF",
        "startRow": 0,
        "startCol": 4
      },
      {
        "number": 2,
        "direction": "down",
        "clue": "Geld für die Arbeit",
        "answer": "LOHN",
        "startRow": 1,
        "startCol": 2
      },
      {
        "number": 4,
        "direction": "down",
        "clue": "Eine Gruppe von Kollegen",
        "answer": "TEAM",
        "startRow": 2,
        "startCol": 6
      },
      {
        "number": 5,
        "direction": "down",
        "clue": "Arbeitsort mit Schreibtischen",
        "answer": "BUERO",
        "startRow": 2,
        "startCol": 9
      }
    ]
  }
];
