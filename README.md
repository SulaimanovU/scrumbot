TODO:
1) Bot fabric infostructure
2) Graylog/Winston logging
3) Bug reporting
4) add ability to set member position
5) fix cron time (when i pass 11 as a time to allarm it works only at 00:00) maybe because different UTC offcet
i can check what is the time in our vps server
6) add method which will send url to google meet at specific time to group
7) think about memeber leave event (what we shoul do) and do it. also think about leave member cmd, to make able to
members move to another groups
8) disable scrum bot when it was deleted from group

FIXED:
1) bot saving when as a memeber when it joined to chat
2) fix saving report from nonnative group for memebers
3) fix error with sql query which returns member who did not send reports from all group
4) make new_member_event call scrum_init_cmd when scrum bot came as a new user