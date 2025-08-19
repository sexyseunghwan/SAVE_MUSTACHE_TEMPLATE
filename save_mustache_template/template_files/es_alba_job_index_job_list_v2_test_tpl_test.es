{
			"query": {
				"bool": {
					{{#tpl_albamap_on}}
						"must": {
							"geo_bounding_box": {
								"geolocation": {
									"top_left": {
										"lat": {{tpl_must_lefttop_laty}},
										"lon": {{tpl_must_lefttop_lngx}}
									},
									"bottom_right": {
										"lat": {{tpl_must_rightbottom_laty}},
										"lon": {{tpl_must_rightbottom_lngx}}
									}
								}
							}
						},
					{{/tpl_albamap_on}}
					{{^tpl_albamap_on}}
						{{#tpl_keyword_on}}
						{{#tpl_joblist_keyword}}
						"must" : [
							{
								"multi_match": {
									"query": "{{tpl_joblist_keyword}}",
									"fields": ["recommendkeyword","workcomnm","jkname","title","chargehplacenm"],
									"operator": "OR"
								}
							}
						],
						{{/tpl_joblist_keyword}}
						{{#tpl_joblist_not_keyword}}
						"must_not":[
							{
								"multi_match": {
									"query": "{{tpl_joblist_not_keyword}}",
									"fields": ["recommendkeyword","workcomnm","jkname","title","chargehplacenm"],
									"operator": "OR"
								}
							}
						],
						{{/tpl_joblist_not_keyword}}
						{{/tpl_keyword_on}}
						{{^tpl_keyword_on}}
						"must": {
							"match_all": {}
						},
						{{/tpl_keyword_on}}
					{{/tpl_albamap_on}}
					"filter": [
						{{!!!!!근무요일}}
						{{#tpl_filter_isweek}}
						{
							"bool": {
								"should": [
									{{#tpl_filter_common_workweekcd}}
									{
										"terms": {
											"workweekcd": ["{{#tpl_filter_common_workweekcd}}", "{{.}}", "{{/tpl_filter_common_workweekcd}}"]
										}
									},
									{{/tpl_filter_common_workweekcd}}
									{{#tpl_filter_common_weekdays}}
									{{#tpl_isweekdays_filter}}
									{
										"terms": {
											"integrationoption": ["{{#tpl_filter_common_weekdays}}", "{{.}}", "{{/tpl_filter_common_weekdays}}"]
										}
									},
									{{/tpl_isweekdays_filter}}
									{{^tpl_isweekdays_filter}}
									{
										"query_string": {
											"default_field": "integrationoption",
											"query": "{{tpl_filter_common_weekdays}}"
										}
									},
									{{/tpl_isweekdays_filter}}
									{{/tpl_filter_common_weekdays}}
									{{#tpl_filter_common_weekdaycnt}}
									{
										"terms": {
											"workdaycnt": ["{{#tpl_filter_common_weekdaycnt}}", "{{.}}", "{{/tpl_filter_common_weekdaycnt}}"]
										}
									},
									{{/tpl_filter_common_weekdaycnt}}
									{
										"exists": { "field": "xxxxxx"}
									}
								]
							}
						},
						{{/tpl_filter_isweek}}
						{{!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! 공통 !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!}}
						{{!!!!!포함/제외 키워드}}
						{{#tpl_inexclude_keyword}}
						{
							"bool": {
								{{#tpl_include_keyword}}
								"must": [
									{{!!포함 키워드}}
									{
										"multi_match": {
											"query": "{{tpl_include_keyword}}",
											"fields": ["workcomnm","jkname","title","sigudong","jksub","subwayname","attributeoption","hplacenm","tel","htel"],
											"operator": "AND"
										} 
									}	
								]{{#tpl_exclude_keyword}},{{/tpl_exclude_keyword}}
								{{/tpl_include_keyword}}
								{{!!제외 키워드}}
								{{#tpl_exclude_keyword}}
								"must_not": [
									{
										"multi_match": {
											"query": "{{tpl_exclude_keyword}}",
											"fields": ["workcomnm","jkname","title","sigudong","jksub","subwayname","attributeoption","hplacenm","tel","htel"],
											"operator": "OR"
										}
									}
								]
								{{/tpl_exclude_keyword}}
							}
						},
						{{/tpl_inexclude_keyword}}
						{{!!!!!지역}}
						{{#tpl_filter_common_workareamulti}}
						{
							"bool": {
								"should": [
									{{#tpl_filter_common_areacd}}
									{
										"terms": {
											"areacd": ["{{#tpl_filter_common_areacd}}", "{{.}}", "{{/tpl_filter_common_areacd}}"]
										}
									},
									{{/tpl_filter_common_areacd}}
									{{#tpl_filter_common_sigugun}}
									{
										"terms": {
											"sigu": ["{{#tpl_filter_common_sigugun}}", "{{.}}", "{{/tpl_filter_common_sigugun}}"]
										}
									},
									{{/tpl_filter_common_sigugun}}
									{{#tpl_filter_common_ismixeddong}}
									{{#tpl_filter_common_sigudong}}
									{
										"terms": {
											"mixsigudong.keyword": ["{{#tpl_filter_common_sigudong}}", "{{.}}", "{{/tpl_filter_common_sigudong}}"]
										}
									},
									{
										"terms": {
											"sigudong.keyword": ["{{#tpl_filter_common_sigudong}}", "{{.}}", "{{/tpl_filter_common_sigudong}}"]
										}
									},
									{{/tpl_filter_common_sigudong}}
									{{/tpl_filter_common_ismixeddong}}
									{{^tpl_filter_common_ismixeddong}}
									{{#tpl_filter_common_sigudong}}
									{
										"terms": {
											"sigudong.keyword": ["{{#tpl_filter_common_sigudong}}", "{{.}}", "{{/tpl_filter_common_sigudong}}"]
										}
									},
									{{#tpl_ispc}}
									{
										"terms": {
											"mixsigudong.keyword": ["{{#tpl_filter_common_sigudong}}", "{{.}}", "{{/tpl_filter_common_sigudong}}"]
										}
									},
									{{/tpl_ispc}}
									{{/tpl_filter_common_sigudong}}
									{{/tpl_filter_common_ismixeddong}}
									{{#tpl_filter_common_isgeoquery}}
									{{#tojson}}geo_query{{/tojson}},
									{{/tpl_filter_common_isgeoquery}}
									{{#tpl_filter_common_mixeddong}}
									{
										"terms": {
											"mixsigudong.keyword": ["{{#tpl_filter_common_mixeddong}}", "{{.}}", "{{/tpl_filter_common_mixeddong}}"]
										}
									},
									{
										"terms": {
											"sigudong.keyword": ["{{#tpl_filter_common_mixeddong}}", "{{.}}", "{{/tpl_filter_common_mixeddong}}"]
										}
									},
									{{/tpl_filter_common_mixeddong}}
									{
										"exists": { "field": "xxxxxx"}
									}
								]
							}
						},
						{{/tpl_filter_common_workareamulti}}
						{{!!!!!바 직종 제외}}
						{{#tpl_filter_common_barexclusion}}
						{
							"bool": {
								"must_not": {
									"terms": {
										"jkcode": ["11100000"]
									}
								}
							}
						},
						{{/tpl_filter_common_barexclusion}}
						{{#tpl_filter_common_adid}}
						{
							"bool": {
								"should": [
									{
										"bool": {
											"must":[
												{
													"terms": {
														"jkcode": ["{{#tpl_filter_common_jobkindcode}}", "{{.}}", "{{/tpl_filter_common_jobkindcode}}"]
													}
												},
												{
													"terms": {
														"workperiodcd": ["{{#tpl_filter_common_workperiodcd}}", "{{.}}", "{{/tpl_filter_common_workperiodcd}}"]
													}
												}
											],
											{{#tpl_joblist_season_not_keyword}}
											"must_not":[
												{
													"query_string": {
														"fields": ["recommendkeyword","workcomnm","jkname","title","chargehplacenm"],
														"query": "{{tpl_joblist_season_not_keyword}}",
														"default_operator": "AND",
														"type": "cross_fields"
													}
												}
											]
											{{/tpl_joblist_season_not_keyword}}
										}
									},
									{{#tpl_filter_common_adid}}
									{
										"terms": {
											"adid": ["{{#tpl_filter_common_adid}}", "{{.}}", "{{/tpl_filter_common_adid}}"]
										}
									},
									{{/tpl_filter_common_adid}}
									{
										"exists": { "field": "xxxxxx"}
									}
								]
							}
						},
						{{/tpl_filter_common_adid}}
						{{^tpl_filter_common_adid}}
							{{#tpl_joblist_season_not_keyword}}
							{
								"bool": {
									"must_not": {
										"query_string": {
											"fields": ["recommendkeyword","workcomnm","jkname","title","chargehplacenm"],
											"query": "{{tpl_joblist_season_not_keyword}}",
											"default_operator": "AND",
											"type": "cross_fields"
										}
									}
								}
							},
							{{/tpl_joblist_season_not_keyword}}
							{{!!!!!업직종 제외 / 포함}}
							{{#tpl_filter_common_jobkindnot}}
							{
								"bool": {
									"must_not": {
										"terms": {
											"jkcode": ["{{#tpl_filter_common_jobkindcode}}", "{{.}}", "{{/tpl_filter_common_jobkindcode}}"]
										}
									}
								}
							},
							{{/tpl_filter_common_jobkindnot}}
							{{^tpl_filter_common_jobkindnot}}
							{{#tpl_filter_common_jobkindcode}}
							{
								"terms": {
									"jkcode": ["{{#tpl_filter_common_jobkindcode}}", "{{.}}", "{{/tpl_filter_common_jobkindcode}}"]
								}
							},
							{{/tpl_filter_common_jobkindcode}}
							{{/tpl_filter_common_jobkindnot}}
							{{!!!!!근무기간}}
							{{#tpl_filter_common_workperiodcd}}
							{
								"terms": {
									"workperiodcd": ["{{#tpl_filter_common_workperiodcd}}", "{{.}}", "{{/tpl_filter_common_workperiodcd}}"]
								}
							},
							{{/tpl_filter_common_workperiodcd}}
						{{/tpl_filter_common_adid}}

						{{!!!!!근무시간}}
						{{#tpl_filter_common_worktime}}
						{
							"terms": {
								"worktime": ["{{#tpl_filter_common_worktime}}", "{{.}}", "{{/tpl_filter_common_worktime}}"]
							}
						},
						{{/tpl_filter_common_worktime}}
						{{!!!!!고용형태}}
						{{#tpl_filter_common_hiretypecd}}
						{
							"terms": {
								"integrationoption": ["{{#tpl_filter_common_hiretypecd}}", "{{.}}", "{{/tpl_filter_common_hiretypecd}}"]
							}
						},
						{{/tpl_filter_common_hiretypecd}}
						{{!!!!!성별}}
						{{#tpl_filter_common_gendercd}}
						{
							"terms": {
								"gendercd": ["{{#tpl_filter_common_gendercd}}", "{{.}}", "{{/tpl_filter_common_gendercd}}"]
							}
						},
						{{/tpl_filter_common_gendercd}}
						{{!!!!!연령}}
						{{#tpl_filter_common_ageunderupper}}
						{{!!!!!18세이하}}
						{{#tpl_filter_common_agelimitmax}}
						{
							"bool": {
								"should": [
									{
										"bool": {
											"must": [
												{
													"term": {
														"agelimitcd": "G02"
													}
												},
												{
													"range": {
														"agelimitmin": {"lte":"{{tpl_filter_common_agelimitmax}}"}
													}
												}
											]
										}
									}
									{{!!무관포함}}
									{{#tpl_filter_common_unrelated}}
									,{
										"term": {
											"agelimitcd": "G01"
										}
									}
									{{/tpl_filter_common_unrelated}}
								],
								"must_not":[
									{
										"terms": { "ageoption": ["04", "03|04"] }
									},
									{
										"terms": {
											"jkcode": ["11100000","13080000","14160000","14250000"]
										}
									}
								]
							}
						},
						{{/tpl_filter_common_agelimitmax}}
						{{!!!!!51세이상}}
						{{#tpl_filter_common_agelimitmin}}
						{
							"bool": {
								"should": [
									{
										"bool": {
											"must": [
												{
													"term": {
														"agelimitcd": "G02"
													}
												},
												{
													"range": {
														"agelimitmax": {"gte":"{{tpl_filter_common_agelimitmin}}"}
													}
												}
											]
										}
									}
									{{#tpl_filter_common_unrelated}}
									,{
										"term": {
											"agelimitcd": "G01"
										}
									}
									{{/tpl_filter_common_unrelated}}
								]
							}
						},
						{{/tpl_filter_common_agelimitmin}}
						{{/tpl_filter_common_ageunderupper}}
						{{^tpl_filter_common_ageunderupper}}
						{{#tpl_filter_common_agelimitmin}}
						{
							"bool": {
								"should": [
									{
										"bool": {
											"must": [
												{{#tpl_filter_common_agelimitmin}}
												{
													"range": {
														"agelimitmax": {"gte":"{{tpl_filter_common_agelimitmin}}"}
													}
												}
												{{#tpl_filter_common_agelimitmax}},{{/tpl_filter_common_agelimitmax}}
												{{/tpl_filter_common_agelimitmin}}
												{{#tpl_filter_common_agelimitmax}}
												{
													"range": {
														"agelimitmin": {"lte":"{{tpl_filter_common_agelimitmax}}"}
													}
												}
												{{/tpl_filter_common_agelimitmax}}
											]
										}
									}
									{{#tpl_filter_common_unrelated}},
									{
										"bool": {
											"must": [
												{
													"term": {
														"agelimitmax": "0"
													}
												},
												{
													"term": {
														"agelimitmin": "0"
													}
												}
											]
										}
									},
									{
										"bool": {
											"must": [
												{
													"term": {
														"agelimitcd": "G01"
													}
												}
											]
										}
									}
									{{/tpl_filter_common_unrelated}}
								]
							}
						},
						{{/tpl_filter_common_agelimitmin}}
						{{/tpl_filter_common_ageunderupper}}

						{{#tpl_filter_common_ageunrelatedonly}}
						{
							"term": {
								"agelimitcd": "G01"
							}
						},
						{{/tpl_filter_common_ageunrelatedonly}}

						{{!!!!!경력}}
						{{#tpl_filter_common_careercd}}
						{
							"bool": {
								"should": [
									{
									"terms": { "jobcareercd": ["{{#tpl_filter_common_careercd}}","{{.}}","{{/tpl_filter_common_careercd}}"]}
									}
								],
								"must_not":[
									{
									"terms": { "jobcareercd": [""]}
									}
								]
							}
						},
						{{/tpl_filter_common_careercd}}
						{{!!!!!학력}}
						{{#tpl_filter_common_lastschoolcd}}
						{
							"terms": {
								"lastschoolcd": ["{{#tpl_filter_common_lastschoolcd}}", "{{.}}", "{{/tpl_filter_common_lastschoolcd}}"]
							}
						},
						{{/tpl_filter_common_lastschoolcd}}
						{{!!!!!복리후생}}
						{{#tpl_filter_common_welfarecd}}
						{
							"terms": {
								"integrationoption": ["{{#tpl_filter_common_welfarecd}}", "{{.}}", "{{/tpl_filter_common_welfarecd}}"]
							}
						},
						{{/tpl_filter_common_welfarecd}}
						{{!!!!!우대조건}}
						{{#tpl_filter_common_special}}
						{
							"terms": {
								"integrationoption": ["{{#tpl_filter_common_special}}", "{{.}}", "{{/tpl_filter_common_special}}"]
							}
						},
						{{/tpl_filter_common_special}}
						{{!!!!!기타조건}}
						{{#tpl_filter_common_etccd}}
						{
							"terms": {
								"integrationoption": ["{{#tpl_filter_common_etccd}}", "{{.}}", "{{/tpl_filter_common_etccd}}"]
							}
						},
						{{/tpl_filter_common_etccd}}
						{{!!!!!지원방법}}
						{{#tpl_filter_common_acceptmethod}}
						{
							"terms": {
								"integrationoption": ["{{#tpl_filter_common_acceptmethod}}", "{{.}}", "{{/tpl_filter_common_acceptmethod}}"]
							}
						},
						{{/tpl_filter_common_acceptmethod}}
						{{!!!!!검색기간_등록일}}
						{{#tpl_filter_common_freeorderrange}}
						{
						  "bool": {
								"must": [
								  {
										"range": {
											"freeorder": {"gte":"{{tpl_filter_common_freeorderrange}}"}
										}
									}
						    ]
						  }
						},
						{{/tpl_filter_common_freeorderrange}}
						{{!!!!!검색기간_마감일}}
						{{#tpl_filter_common_recuitendrange}}
						{
						  "bool": {
								"must": [
								  {
										"range": {
											"recruitendyyyymmdd": {"gt":"{{tpl_filter_common_recuitendsrange}}"}
										}
									},
									{
										"range": {
											"recruitendyyyymmdd": {"lt":"{{tpl_filter_common_recuitenderange}}"}
										}
									}
						    ]
						  }
						},
						{{/tpl_filter_common_recuitendrange}}
						{{!!!!!MUDGE공고}}
						{{#tpl_filter_common_nudgejob}}
						{{/tpl_filter_common_nudgejob}}
						{{^tpl_filter_common_nudgejob}}
						{
							"bool": {
								"must_not": [
									{"term": {"nudge": "Y"}}
								]
							}
						},
						{{/tpl_filter_common_nudgejob}}
						{{!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!}}
						{{!!!!!옵션 유료상품타입}}
						{{#tpl_filter_postcd}}
						{
							"term": {
								"postcd": "{{tpl_filter_postcd}}"
							}
						},
						{{/tpl_filter_postcd}}
						{{!!!!!단기 알바}}
						{{#tpl_filter_isshortperioddata}}
						{
							"bool": {
								"must": [
									{
										"range": {
											"workstartyyyymmdd": {"gte":"{{tpl_filter_workstartyyyymmdd}}"}
										}
									},
									{
										"range": {
											"workendyyyymmdd": {"lte":"{{tpl_filter_workendyyyymmdd}}"}
										}
									}
								]
							}
						},
						{{/tpl_filter_isshortperioddata}}
						{{#tpl_filter_work_isonedaydata}}
						{
							"terms": {
								"workstartyyyymmdd": ["{{#tpl_filter_work_oneday}}", "{{.}}", "{{/tpl_filter_work_oneday}}"]
							}
						},
						{{/tpl_filter_work_isonedaydata}}
						{{#tpl_filter_shortyn}}
						{
							"terms": {
								"shortyn": ["{{#tpl_filter_shortyn}}", "{{.}}", "{{/tpl_filter_shortyn}}"]
							}
						},
						{{/tpl_filter_shortyn}}
						{{!!!!!단기 알바 끝}}
						{{!!!!!역세권}}
						{{#tpl_filter_subway}}
						{
							"bool": {
								"should": [
									{{#tpl_filter_subwayline}}
									{
										"terms": {
											"subwayline": ["{{#tpl_filter_subwayline}}", "{{.}}", "{{/tpl_filter_subwayline}}"]
										}
									},
									{{/tpl_filter_subwayline}}
									{{#tpl_filter_subwaystation}}
									{
										"terms": {
											"subwaystation": ["{{#tpl_filter_subwaystation}}", "{{.}}", "{{/tpl_filter_subwaystation}}"]
										}
									},
									{{/tpl_filter_subwaystation}}
									{
										"exists": { "field": "xxxxxx"}
									}
								]
							}
						},
						{{/tpl_filter_subway}}
						{{#tpl_filter_subwayyn}}
						{
							"term": {
								"subwayyn": "{{tpl_filter_subwayyn}}"
							}
						},
						{{/tpl_filter_subwayyn}}
						{{!!!!!대학가}}
						{{#tpl_filter_univ}}
						{
							"bool": {
								"should": [
									{{#tpl_filter_uniarea}}
									{
										"bool": {
											"should": [
												{
													"terms": { "areacd": ["{{#tpl_filter_uniarea}}","{{.}}","{{/tpl_filter_uniarea}}"]}
												}
												],
											"must_not":[
												{
													"terms": { "unicd": [""]}
												}
												]
										}
									},
									{{/tpl_filter_uniarea}}
									{{#tpl_filter_unicd}}
									{
										"bool": {
											"should": [
												{
													"terms": { "unicd": ["{{#tpl_filter_unicd}}","{{.}}","{{/tpl_filter_unicd}}"]}
												}
												],
											"must_not":[
												{
													"terms": { "unicd": [""]}
												}
												]
										}
									},
									{{/tpl_filter_unicd}}
									{
										"exists": { "field": "xxxxxx"}
									}
								]
							}
						},
						{{/tpl_filter_univ}}
						{{!!!!!꿀알바 채용관}}
						{{#tpl_filter_honey}}
						{
							"term": {
								"honeyyn": "Y"
							}
						},
						{{#tpl_filter_honeycd}}
						{
							"term": {
								"honeycd": "{{tpl_filter_honeycd}}"
							}
						},
						{{/tpl_filter_honeycd}}
						{{/tpl_filter_honey}}
						{{!!!!!급여별 채용관}}
						{{#tpl_filter_paycd}}
						{
							"term": {
								"paycd": "{{tpl_filter_paycd}}"
							}
						},
						{{/tpl_filter_paycd}}
						{{#tpl_filter_payyn}}
						{
							"bool": {
								"must": [
									{{#tpl_filter_pay}}
									{
										"range": {
											"pay": {"gte":"{{tpl_filter_pay}}"}
										}
									}
									{{#tpl_filter_payend}}
									,
									{{/tpl_filter_payend}}
									{{/tpl_filter_pay}}
									{{#tpl_filter_payend}}
									{
										"range": {
											"pay": {"lte":"{{tpl_filter_payend}}"}
										}
									}
									{{/tpl_filter_payend}}
								]
							}
						},
						{{/tpl_filter_payyn}}
						{{^tpl_filter_payyn}}
						{{#tpl_filter_pay}}
						{
							"bool": {
								"must": [
									{
										"range": {
											"pay": {"gte":"{{tpl_filter_pay}}"}
										}
									}
								]
							}
						},
						{{/tpl_filter_pay}}
						{{/tpl_filter_payyn}}
						{{#tpl_filter_payaddtype}}
						{
							"terms": {
								"integrationoption": ["{{#tpl_filter_payaddtype}}", "{{.}}", "{{/tpl_filter_payaddtype}}"]
							}
						},
						{{/tpl_filter_payaddtype}}
						{{!!!!!우대별 청소년 채용관}}
						{{#tpl_filter_youthyn}}
						{
							"term": {
								"youthyn": "Y"
							}
						},
						{{/tpl_filter_youthyn}}
						{{!!!!!우대별 대학생 채용관}}
						{{#tpl_filter_univst}}
						{
							"terms": {
								"integrationoption": ["M02","M03"]
							}
						},
						{{/tpl_filter_univst}}
						{{!!!!!우대별 대학(재학,휴학)생 채용관, 장애인}}
						{{#tpl_filter_target}}
						{
							"term": {
								"integrationoption": "{{tpl_filter_target}}"
							}
						},
						{{/tpl_filter_target}}
						{{!!!!!추가선택 외국인 채용관}}
						{{#tpl_filter_foreigner}}
						{
							"terms": {
								"integrationoption": ["M07"]
							}
						},
						{{/tpl_filter_foreigner}}
						{{!!!!!우대별 중장년 채용관}}
						{{#tpl_filter_senior}}
						{
							"term": {
								"senioryn": "Y"
							}
						},
						{{#tpl_filter_senior_theme}}
						{
							"bool": {
								"should": [
									{{!!!!!식사지원 알바}}
									{{#senior_theme_theme01}}
									{
										"terms": {
											"integrationoption": ["E01"]
										}
									},
									{{/senior_theme_theme01}}
									{{!!!!!높은급여 알바}}
									{{#senior_theme_theme02}}
									{
										"bool": {
											"must":[
												{
													"term": {"paycd": "I04"}
												},
												{
													"range" : {
														"pay" : {"gte" : "3000000"}
													}
												}
											]
										}
									},
									{{/senior_theme_theme02}}
									{{!!!!!통큰버스 알바}}
									{{#senior_theme_theme07}}
									{
										"terms": {
											"integrationoption": ["E02","T15"]
										}
									},
									{{/senior_theme_theme07}}
									{{!!!!!단시간 알바}}
									{{#senior_theme_theme08}}
									{
										"terms": {
											"shortyn": ["Y","Y1","Y2","Y3","Y4","T","T1","T2","T3","T4"]
										}
									},
									{{/senior_theme_theme08}}
									{{!!!!!기숙사제공 알바}}
									{{#senior_theme_theme12}}
									{
										"terms": {
											"integrationoption": ["T14"]
										}
									},
									{{/senior_theme_theme12}}
									{
										"term": {
											"senioryn": "Y"
										}
									}
								], "minimum_should_match" : 2
							}
						},
						{{/tpl_filter_senior_theme}}
						{{/tpl_filter_senior}}
						{{!!!!!우대별 장애인 채용관}}
						{{#tpl_filter_impairment}}
						{
							"terms": {
								"integrationoption": ["M06"]
							}
						},
						{{/tpl_filter_impairment}}
						{{!!!!!우대별 초보가능 채용관}}
						{{#tpl_filter_beginner}}
						{
							"term": {
								"integrationoption": "M01"
							}
						},
						{{/tpl_filter_beginner}}
						{{!!!!!우대별 주부가능 채용관}}
						{{#tpl_filter_housewife}}
						{
							"term": {
								"integrationoption": "M04"
							}
						},
						{{/tpl_filter_housewife}}
						{{!!!!!정직원 T02:건강보험, T03:고용보험}}
						{{!!!!!K02:정규직, K03:계약직, K04:파견직, K05:인턴직}}
						{{!!!!!H06:6개월~1년, H07:기간협의, H09:1년이상}}
						{{#tpl_filter_recruit}}
						{
							"terms": {
								"integrationoption": ["T02"]
							}
						},
						{
							"terms": {
								"integrationoption": ["T03"]
							}
						},
						{
							"terms": {
								"integrationoption": ["K02", "K03", "K04", "K05"]
							}
						},
						{
							"terms": {
								"workperiodcd": ["H06", "H07", "H09"]
							}
						},
						{{/tpl_filter_recruit}}
						{{!!!!!핫플레이스 채용관용 code}}
						{{#tpl_filter_hplacecd}}
						{
							"term": {
								"hplacecd": "{{tpl_filter_hplacecd}}"
							}
						},
						{{/tpl_filter_hplacecd}}
						{{#tpl_filter_hplacesido}}
						{
							"term": {
								"hplacesido.sep": "{{tpl_filter_hplacesido}}"
							}
						},
						{{/tpl_filter_hplacesido}}
						{{!!!!!브랜드알바 채용관용 code}}
						{{#tpl_filter_brandcd}}
						{
							"term": {
								"brcd": "{{tpl_filter_brandcd}}"
							}
						},
						{{/tpl_filter_brandcd}}
						{{!!!!!콜센터 채용관용 code}}
						{{#tpl_filter_callcd}}
						{
							"term": {
								"callcd": "{{tpl_filter_callcd}}"
							}
						},
						{{/tpl_filter_callcd}}
						{{!!!!!더캠프 채용관}}
						{{#tpl_filter_thecamp}}
						{
							"terms": {
								"integrationoption": ["G11"]
							}
						},
						{{/tpl_filter_thecamp}}
						{{!!!!!주휴수당 채용관}}
						{{#tpl_filter_holidaypay}}
						{
							"bool": {
								"should": [
								  {
								    "term": {
								      "holidayyn": "Y"
								    }
								  },
								  {
								    "term": {
								      "integrationoption": "T16"
								    }
								  }
								]
							}
						},
						{{/tpl_filter_holidaypay}}
						{{!상세검색 - 안심계약}}
						{{#tpl_filter_safeconst}}
						{
						"term": {
						    "integrationoption": "Z02" 
						  }
						},
						{{/tpl_filter_safeconst}}
						{{!!!!!맞춤 조건 추가 시작}}
						{{#tpl_filter_not_weekdays}}
						{
							"bool": {
								"must_not":{
									"terms": {
										"integrationoption": ["{{#tpl_filter_not_weekdays}}", "{{.}}", "{{/tpl_filter_not_weekdays}}"]
									}
								}
							}
						},
						{{/tpl_filter_not_weekdays}}
						{{#tpl_filter_worktime}}
						{
							"bool": {
								"must_not":{
									"terms": {
										"worktime": ["J05"]
									}
								}
							}
						},
						{
							"bool": {
								"should": [
									{{#tpl_filter_workstartendtime}}
									{
										"bool": {
											"must": [
												{
													"range": {
														"fa_workstarthhmi": {
															"gte":"{{tpl_filter_workstarthhmi}}",
															"lte":"{{tpl_filter_workendhhmi}}"
														}
													}
												},
												{
													"range": {
														"fa_workendhhmi": {
															"gte":"{{tpl_filter_workstarthhmi}}",
															"lte":"{{tpl_filter_workendhhmi}}"
														}
													}
												}
											]
										}
									},
									{{/tpl_filter_workstartendtime}}
									{{#tpl_filter_ismorning}}
									{
										"bool": {
											"must": [
												{
													"range": {
														"fa_workstarthhmi": {
															"gte":"600",
															"lte":"1200"
														}
													}
												},
												{
													"range": {
														"fa_workendhhmi": {
															"gte":"600",
															"lte":"1200"
														}
													}
												}
											]
										}
									},
									{{/tpl_filter_ismorning}}
									{{#tpl_filter_isafternoon}}
									{
										"bool": {
											"must": [
												{
													"range": {
														"fa_workstarthhmi": {
															"gte":"1200",
															"lte":"1800"
														}
													}
												},
												{
													"range": {
														"fa_workendhhmi": {
															"gte":"1200",
															"lte":"1800"
														}
													}
												}
											]
										}
									},
									{{/tpl_filter_isafternoon}}
									{{#tpl_filter_isevening}}
									{
										"bool": {
											"must": [
												{
													"range": {
														"fa_workstarthhmi": {
															"gte":"1800",
															"lte":"2400"
														}
													}
												},
												{
													"range": {
														"fa_workendhhmi": {
															"gte":"1800",
															"lte":"2400"
														}
													}
												}
											]
										}
									},
									{{/tpl_filter_isevening}}
									{{#tpl_filter_isnight}}
									{
										"bool": {
											"must": [
												{
													"range": {
														"fa_workstarthhmi": {
															"gte":"0",
															"lte":"600"
														}
													}
												},
												{
													"range": {
														"fa_workendhhmi": {
															"gte":"0",
															"lte":"600"
														}
													}
												}
											]
										}
									},
									{{/tpl_filter_isnight}}
									{
										"exists": { "field": "xxxxx"}
									}
								]
							}
						},
						{{/tpl_filter_worktime}}
						{{!!!!!맞춤 조건 추가 끝}}
						{{!!!!!공고관리 게재위치 확인용}}
						{{#tpl_filter_mysearchrecruityyyymmdd}}
						{{#tpl_filter_mysearchadid}}
						{
							"term": {
								"recruitstartyyyymmdd": "{{tpl_filter_mysearchrecruityyyymmdd}}"
							}
						},
						{
							"bool": {
								"must": [
									{
										"range": {
											"adid": {"gte":"{{tpl_filter_mysearchadid}}"}
										}
									}
								]
							}
						},
						{{/tpl_filter_mysearchadid}}
						{{^tpl_filter_mysearchadid}}
						{
							"bool": {
								"must": [
									{
										"range": {
											"recruitstartyyyymmdd": {"gt":"{{tpl_filter_mysearchrecruityyyymmdd}}"}
										}
									}
								]
							}
						},
						{{/tpl_filter_mysearchadid}}
						{{/tpl_filter_mysearchrecruityyyymmdd}}
						{{!!!!! adid 로 공고 조회해오기 (알바포유)}}
						{{#tpl_filter_adid}}
						{
							"terms": {
								"adid": ["{{#tpl_filter_adid}}", "{{.}}", "{{/tpl_filter_adid}}"]
							}
						},
						{{/tpl_filter_adid}}
						{
							"exists": { "field": "adid"}
						}
					]
				}
			},
			"aggs": {
				"nudge": {
					"terms": {
						"field": "nudge",
						"size": 1000
					}
			}
			{{#tpl_aggs_hplacenm}}
				,"hplacenmaggs": {
					"terms": {
						"field": "hplacenm.keyword",
						"order": { "_count": "desc" },
						"size": 1000
					}
				}
			{{/tpl_aggs_hplacenm}}
			{{#tpl_aggs_callcd}}
			,	"callcdaggs": {
					"terms": {
						"field": "callcd",
						"order": { "_count": "desc" },
						"size": 1000
					}
				}
			{{/tpl_aggs_callcd}}
			{{#tpl_aggs_brandcd}}
				,"brandcdaggs": {
					"terms": {
						"field": "brcd",
						"order": [{ "_count": "desc"},{ "_key": "desc"}],
						"size": 1000
					}
				}
			{{/tpl_aggs_brandcd}}
			{{#tpl_aggs_subwaystation}}
				,"subwaystationaggs": {
					"terms": {
						"field": "subwaystation",
						"order": [{ "_count": "desc"},{ "_key": "desc"}],
						"size": 5000
					}
				}
			{{/tpl_aggs_subwaystation}}
			},
			"_source": ["{{#tpl_source}}", "{{.}}", "{{/tpl_source}}","{{^tpl_source}}", "*", "{{/tpl_source}}"],
			"sort": {{#tojson}}tpl_sort{{/tojson}},
			"from": {{tpl_from}}{{^tpl_from}}0{{/tpl_from}},
			"size": {{tpl_size}}{{^tpl_size}}20{{/tpl_size}},
			"track_total_hits":true
		}