var stringJSON;  // для выгрузки json строки

const { createApp } = Vue;

createApp({
    data() {
        return {
            gameName: '',
            gameDate: '',
            gameHost: '',
            juries: [{ id: 0, name: '', description: '' }],
            teams: [{ id: 0, name: '', description: '', marks: { 0: [0] }, sum: 0, votes: 0 }],
            contests: [{ id: 0, name: '', max: 0 }],
            dataJSON: {},  // для работы с импортами
            dataToCopy: '',
            dataToImport: ''
        }
    },
    methods: {
        addJury(i) {
            this.juries.push({ id: i, name: '', description: '' })
        },
        deleteJury(i) {
            this.juries.splice(i, 1)
        },
        addTeam(i) {
            this.teams.push({ id: i, name: '', description: '', marks: { 0: [0] }, sum: 0 })
        },
        deleteTeam(i) {
            this.teams.splice(i, 1)
        },
        addContest(i) {
            this.contests.push({ id: i, name: '', max: 0 });
        },
        deleteContest(i) {
            this.contests.splice(i, 1);
        },
        compileJSONdata() {
            this.dataJSON.name = this.gameName;
            this.dataJSON.date = this.gameDate;
            this.dataJSON.host = this.gameHost;
            this.dataJSON.juries = this.juries;
            this.dataJSON.teams = this.teams;
            console.log(this.dataJSON.teams);
            this.dataJSON.contests = this.contests;

            if (this.dataJSON.host == '' || this.dataJSON.juries[0].name == '' || this.dataJSON.teams[0].name == '' || this.dataJSON.contests[0].name == '') {
                console.log('can`t write json, something is missing')
            }
            else {
                const jsonString = JSON.stringify(this.dataJSON);
                this.dataToCopy = jsonString;
                nodecg.sendMessage('passJSON', jsonString);
                nodecg.sendMessage('passJSONtoScoreboard', jsonString);
            }
        },
        importData(dataJSON) {
            if (dataJSON == "") {
                console.log('JSON string is empty, can`t parse')
            } else {
                stringJSON = JSON.parse(dataJSON);
                nodecg.sendMessage('JSON imported', stringJSON);
                nodecg.log.info('JSON imported');
                this.gameName = stringJSON.name;
                this.gameDate = stringJSON.date;
                this.gameHost = stringJSON.host;
                this.juries = stringJSON.juries;
                this.teams = stringJSON.teams;
                this.contests = stringJSON.contests;
                nodecg.sendMessage('passJSON', dataJSON);
                nodecg.sendMessage('passJSONtoScoreboard', dataJSON);
            }
        },
    },
    computed: {

    },
    mounted() {
        nodecg.listenFor('save marks', 'kvn-scoreboard', (teamsFromScoreboard) => {
            //console.log('save marks');
            this.teams = teamsFromScoreboard;
            this.teams.forEach((team) => {
                team.sum = parseInt(team.sum);
                team.votes = parseInt(team.votes);
            })
            //console.log('this.teams', this.teams);
            this.compileJSONdata();
        });
    }
}).mount('#app');
