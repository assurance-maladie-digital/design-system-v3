| #  | Input             | Expected Result | Description                                                                                   |
|----|-------------------|-----------------|-----------------------------------------------------------------------------------------------|
| 1  | 1840275123456 74   | valid           | NIR complet avec clé correcte (ex. homme né en 1984, département 75...).                     |
| 2  | 2910256012345 46   | valid           | NIR complet avec clé correcte (ex. femme née en 1991, département 25...).                    |
| 3  | 198012312345690   | valid           | NIR complet (ex. homme né en 1980, département 12...), clé calculée et valide.               |
| 4  | 2551299123457 80   | valid           | NIR complet (ex. femme née en 1951, département 29...).                                      |
| 5  | 2100121101003 73   | valid           | NIR complet (ex. femme née en 2000, département 21...).                                      |
| 6  | 3840275123456 74   | invalid         | Le premier chiffre (3) n'est pas valide (doit être 1 ou 2).                                  |
| 7  | 1841375123456 74   | invalid         | Le mois 13 est invalide (doit être compris entre 01 et 12).                                  |
| 8  | 1840275123456 73   | invalid         | Clé de contrôle incorrecte (73 au lieu de 74).                                               |
| 9  | 1840A75123456 74   | invalid         | Contient une lettre 'A' dans la chaîne, format strictement numérique attendu.                |
| 10 | 1840275123456     | invalid         | Chaîne trop courte (13 chiffres sans clé). Le NIR doit comporter 15 chiffres.                |
