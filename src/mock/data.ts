/* tslint:disable */

export default
  {
    forms: [
      {
        "links": {
          "self": "http://localhost:3000"
        },
        "data": {
          "id": "1029",
          "attributes": {
            "title": "Intresseanmälan - visningstjänst",
            "description": "<p>I den h&auml;r e-tj&auml;nsten visas de funktioner som det nya verktyget f&ouml;r enkel dataf&aring;ngst har. Namn p&aring; f&auml;lt osv. kan &auml;ndras utifr&aring;n behov och &auml;ndringsbeslut fr&aring;n kommunikationsenheten. F&ouml;r att starta e-tj&auml;nsten tryck p&aring; &rdquo;Starta&rdquo;.</p>",
            "status": "Published",
            "path": "Visningstjanst",
            "integrations": [
              {
                "type": "Sharepoint",
                "options": [
                  {
                    "key": "title",
                    "value": "Till SP - IT Test och utveckling",
                    "id": 112
                  },
                  {
                    "key": "siteTitle",
                    "value": "IT test och utveckling",
                    "id": 113
                  },
                  {
                    "key": "userEmail",
                    "value": "helena.ferm@umea.se",
                    "id": 114
                  }
                ],
                "id": 3
              },
              {
                "type": "Email",
                "options": [
                  {
                    "key": "title",
                    "value": "Mejl till Lena",
                    "id": 85
                  },
                  {
                    "key": "subject",
                    "value": "Ny insickning av visningstjänsten",
                    "id": 86
                  },
                  {
                    "key": "attachFiles",
                    "value": "false",
                    "id": 87
                  },
                  {
                    "key": "body",
                    "value": "<p>Dokumentet finns i underplats h&auml;r <a href=\"https://umea.sharepoint.com/sites/BasicUse\" target=\"_blank\" rel=\"noopener\">Samlingsplats BasicUse</a></p>",
                    "id": 88
                  },
                  {
                    "key": "sender",
                    "value": "noreply@umea.se",
                    "id": 89
                  },
                  {
                    "key": "receiver",
                    "value": "lena.risholt@umea.se",
                    "id": 90
                  }
                ],
                "id": 11
              }
            ],
            "gDPR": {
              "dataControllers": [
                {
                  "type": "dataController",
                  "title": "Tekniska nämnden",
                  "url": "https://www.umea.se/umeakommun/kommunochpolitik/overklagabeslutrattssakerhet/dataskyddsforordningengdpr/behandlingavpersonuppgifter.4.42f5a78c162dae6939049d.html",
                  "id": 1
                }
              ]
            },
            "steps": [
              {
                "type": "step",
                "title": "Intresse",
                "description": "",
                "fields": [
                  {
                    "type": "FieldSelectList",
                    "title": "Välj intresseområde",
                    "value": "",
                    "helpText": "Du kan välja ett alternativ",
                    "sortIndex": 1,
                    "fieldOptions": {
                      "items": [
                        {
                          "title": "Fågel",
                          "isChecked": false,
                          "id": "-93209"
                        },
                        {
                          "title": "Fisk",
                          "isChecked": false,
                          "id": "-97208"
                        },
                        {
                          "title": "Mittemellan",
                          "isChecked": false,
                          "id": "-47875"
                        }
                      ],
                      "validation": [
                        {
                          "title": "Obligatoriskt fält",
                          "type": "required",
                          "value": "",
                          "requiresValue": false
                        }
                      ]
                    },
                    "guid": "c5fe918e-030f-444c-bee6-00c121889b2f",
                    "displayRuleGuid": "",
                    "id": 54
                  },
                  {
                    "type": "FieldCheckBox",
                    "title": "Vilka årstider tycker du om?",
                    "value": "",
                    "helpText": "Du kan välja ett eller flera alternativ",
                    "sortIndex": 3,
                    "fieldOptions": {
                      "items": [
                        {
                          "title": "Vinter",
                          "isChecked": false,
                          "id": "-37935"
                        },
                        {
                          "title": "Vårvinter",
                          "isChecked": false,
                          "id": "-10155"
                        },
                        {
                          "title": "Vår",
                          "isChecked": false,
                          "id": "-38553"
                        },
                        {
                          "title": "Försommar",
                          "isChecked": false,
                          "id": "-90975"
                        },
                        {
                          "title": "Högsommar",
                          "isChecked": false,
                          "id": "-74828"
                        },
                        {
                          "title": "Sensommar",
                          "isChecked": false,
                          "id": "-78452"
                        },
                        {
                          "title": "Höst",
                          "isChecked": false,
                          "id": "-96467"
                        }
                      ]
                    },
                    "guid": "c99f4fc4-983b-4a85-8256-6412a8ab1d9e",
                    "displayRuleGuid": "",
                    "id": 55
                  },
                  {
                    "type": "FieldRadioButton",
                    "title": "Är det din favorit?",
                    "value": "",
                    "helpText": "Du kan välja ett alternativ",
                    "sortIndex": 2,
                    "fieldOptions": {
                      "items": [
                        {
                          "title": "Ja",
                          "isChecked": false,
                          "id": "-73762"
                        },
                        {
                          "title": "Nej",
                          "isChecked": false,
                          "id": "-53539"
                        }
                      ],
                      "validation": [
                        {
                          "title": "Obligatoriskt fält",
                          "type": "required",
                          "value": "",
                          "requiresValue": false
                        }
                      ]
                    },
                    "guid": "c74d0fea-6b11-4b10-a1a8-9a5988e739d1",
                    "displayRuleGuid": "",
                    "id": 56
                  },
                  {
                    "type": "FieldSection",
                    "title": "Berätta mer",
                    "value": "Vad annat än årstider intresserar dig? Berätta gärna mer för oss:",
                    "helpText": "",
                    "sortIndex": 4,
                    "fieldOptions": {
                      
                    },
                    "guid": "1da075a6-8263-491a-bdd7-236b733f5461",
                    "displayRuleGuid": "",
                    "id": 64
                  },
                  {
                    "type": "FieldTextArea",
                    "title": "Fler intressen",
                    "value": "",
                    "helpText": "Du kan skriva hur långt och hur mycket du vill.",
                    "sortIndex": 5,
                    "fieldOptions": {
                      
                    },
                    "guid": "89017f25-96ba-4457-953d-6e61639486a3",
                    "displayRuleGuid": "",
                    "id": 65
                  }
                ],
                "id": 10
              },
              {
                "type": "step",
                "title": "Bilagor och datum",
                "description": "Den här texten visas överst i ett steg. Det är valfritt.\n\nI det här steget visas funktionerna bifoga fil och välja datum.",
                "fields": [
                  {
                    "type": "FieldFileUpload",
                    "title": "Bifoga flera filer",
                    "value": "",
                    "helpText": "I den här rutan kan du bifoga upp till 10 filer. Minst en fil måste bifogas. Flera olika filtyper är tillåtna.",
                    "sortIndex": 1,
                    "fieldOptions": {
                      "allowMultiple": true,
                      "validation": [
                        
                      ],
                      "fileTypeValidation": "PdfAndWord"
                    },
                    "guid": "b4f310b4-f1d5-4128-af73-51707b2a8d9f",
                    "displayRuleGuid": "",
                    "id": 57
                  },
                  {
                    "type": "FieldFileUpload",
                    "title": "Bifoga en fil (alla typer)",
                    "value": "",
                    "helpText": "Den här rutan kan du bifoga en fil och den får bara vara av jpg-typ.",
                    "sortIndex": 2,
                    "fieldOptions": {
                      "allowMultiple": null,
                      "fileTypeValidation": ""
                    },
                    "guid": "436bcd3a-9f2a-4617-b316-e1e67cdfa95b",
                    "displayRuleGuid": "",
                    "id": 58
                  },
                  {
                    "type": "FieldDatePicker",
                    "title": "En bra dag",
                    "value": "",
                    "helpText": "Välj via kalenderfunktionen eller skriv ÅÅÅÅMMDD",
                    "sortIndex": 3,
                    "fieldOptions": {
                      
                    },
                    "guid": "2d5bad64-2c38-4865-bae6-7616b5a9f6bd",
                    "displayRuleGuid": "",
                    "id": 61
                  }
                ],
                "id": 11
              }
            ],
            "displayRules": [
              
            ],
            "pM3": {
              "title": "Färdtjänst",
              "id": 1
            },
            "receiver": {
              "title": "Administration och innovation",
              "url": "https://www.umea.se/umeakommun/kommunochpolitik/organisation/forvaltningarverksamheter/stadsledning/administrationochinnovation.4.bbd1b101a585d704800078246.html",
              "id": 13
            },
            "createdBy": "Lena.Risholt@umea.se",
            "created": "2019-01-10T10:51:33.6544013",
            "modifiedBy": "viktor.jonsson@umea.se",
            "modified": "2019-04-01T12:36:23.4140344"
          },
          "type": "form"
        },
        "errors": [
          
        ],
        "id": 1029
      },
      {
        "links": {
          "self": "http://localhost:3000"
        },
        "data": {
          "id": "1031",
          "attributes": {
            "title": "Fråga eller beställning till Stadsarkivet",
            "description": "<p>Kort text som beskriver vad e-tj&auml;nsten &auml;r till f&ouml;r</p>",
            "status": "Published",
            "path": "fraga-stadsarkivet",
            "integrations": [
              
            ],
            "gDPR": {
              "dataControllers": [
                {
                  "type": "dataController",
                  "title": "Kommunstyrelsen",
                  "url": "http://www.umea.se/umeakommun/kommunochpolitik/kommunensorganisation/kommunstyrelsen.4.bbd1b101a585d704800074015.html",
                  "id": 12
                }
              ]
            },
            "steps": [
              {
                "type": "step",
                "title": "Fråga eller beställning",
                "description": "",
                "fields": [
                  {
                    "type": "FieldTextArea",
                    "title": "Frågeställning eller beställning",
                    "value": "",
                    "helpText": "Beskriv din frågeställning eller beställning så utförligt som möjligt",
                    "sortIndex": 1,
                    "fieldOptions": {
                      "validation": [
                        {
                          "title": "Obligatoriskt fält",
                          "type": "required",
                          "value": "",
                          "requiresValue": false
                        }
                      ]
                    },
                    "guid": "6d4c674d-0923-4849-9498-5244d4eab86d",
                    "displayRuleGuid": "",
                    "id": 5
                  },
                  {
                    "type": "FieldFileUpload",
                    "title": "Beskrivande dokument",
                    "value": "",
                    "helpText": "Du kan bifoga ett beskrivande dokument för fråga eller beställning",
                    "sortIndex": 2,
                    "fieldOptions": {
                      "acceptedFileTypes": "image/jpg, image/jpeg, image/png , application/pdf",
                      "validation": [
                        
                      ]
                    },
                    "guid": "201fc7dd-ffaf-44f7-9efc-17e7e6ca67e7",
                    "displayRuleGuid": "",
                    "id": 6
                  },
                  {
                    "type": "FieldSection",
                    "title": "Svarsform",
                    "value": "",
                    "helpText": "",
                    "sortIndex": 3,
                    "fieldOptions": {
                      
                    },
                    "guid": "126fe7ec-3f3c-4b53-9af7-8d8fa3cd4103",
                    "displayRuleGuid": "",
                    "id": 7
                  },
                  {
                    "type": "FieldCheckBox",
                    "title": "Svar önskas via",
                    "value": "",
                    "helpText": "",
                    "sortIndex": 4,
                    "fieldOptions": {
                      "items": [
                        {
                          "title": "Telefon",
                          "isChecked": false,
                          "id": "-92099"
                        },
                        {
                          "title": "Mejl",
                          "isChecked": false,
                          "id": "-60886"
                        },
                        {
                          "title": "Brev",
                          "isChecked": false,
                          "id": "-54345"
                        },
                        {
                          "title": "Internpost (endast för kommunala verksamheter)",
                          "isChecked": false,
                          "id": "-6140"
                        }
                      ],
                      "validation": [
                        {
                          "title": "Obligatoriskt fält",
                          "type": "required",
                          "value": "",
                          "requiresValue": false
                        }
                      ]
                    },
                    "guid": "991d55b4-79f8-4382-be02-bf05db326f01",
                    "displayRuleGuid": "",
                    "id": 8
                  },
                  {
                    "type": "FieldSection",
                    "title": "Vilken kategori stämmer bäst in på dig?",
                    "value": "<p>F&ouml;r v&aring;r statistik ber vi dig ange vilken eller vilka av kategorierna som st&auml;mmer b&auml;st in p&aring; dig</p>",
                    "helpText": "",
                    "sortIndex": 5,
                    "fieldOptions": {
                      
                    },
                    "guid": "58a69711-a172-4aec-b506-829e7d908b00",
                    "displayRuleGuid": "",
                    "id": 9
                  },
                  {
                    "type": "FieldCheckBox",
                    "title": "Kategori",
                    "value": "",
                    "helpText": "",
                    "sortIndex": 6,
                    "fieldOptions": {
                      "items": [
                        {
                          "title": "Forskare eller student vid universitet eller skola",
                          "isChecked": false,
                          "id": "-85741"
                        },
                        {
                          "title": "Kommunalt verksamhetsområde",
                          "isChecked": false,
                          "id": "-75611"
                        },
                        {
                          "title": "Kommunalt bolag",
                          "isChecked": false,
                          "id": "-88366"
                        },
                        {
                          "title": "Övrigt",
                          "isChecked": false,
                          "id": "-14570"
                        }
                      ],
                      "validation": [
                        
                      ]
                    },
                    "guid": "d225a869-6341-42d2-be62-2ef4f125845e",
                    "displayRuleGuid": "",
                    "id": 10
                  }
                ],
                "id": 6
              }
            ],
            "displayRules": [
              
            ],
            "pM3": {
              "title": "Kommunikation, Stadsarkivet",
              "id": 4
            },
            "receiver": {
              "title": "Stadsarkivet",
              "url": "test",
              "id": 12
            },
            "createdBy": "Lena.Risholt@umea.se",
            "created": "2019-01-17T09:15:27.2592904",
            "modifiedBy": "Lena.Risholt@umea.se",
            "modified": "2019-03-18T15:51:59.5817556"
          },
          "type": "form"
        },
        "errors": [
          
        ],
        "id": 1031
      }
    ],
    emptyForm: {
      id: 1234,
      links: {
        self: 'http://localhost:3000'
      },
      errors: [],

        type: 'form',
        path: '1234',
        attributes: {
          title: '',
          path: 'mockedpath',
          description: '',
          category: "",
          status: "",
          gDPR: {},
          integrations: [],
          steps: []
        }
    },
    validationRuleTypes: [
      {
        type: 'required',
        requiresValue: false
      }
    ]
  };
