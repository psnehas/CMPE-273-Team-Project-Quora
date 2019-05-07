var assert = require('chai').assert;
var app = require('./index');

var chai = require('chai');
chai.use(require('chai-http'));
var expect = require('chai').expect;

var agent = require('chai').request.agent(app);

describe('Quora simulation', function(){

    it('POST /signin',function(){
        agent.post('/signin')
            .send({
                email: "test40000@sjsu.com",
                password: "123456"
            })
            .end(function(err, res) {
                console.log("Mocha test -- signin:")
                console.log(res.body)
            });
    });
    
    it('PUT /answer/5ccfa29a6df7dc08985b1580/upvote',function(){
        agent.put('/answer/5ccfa29a6df7dc08985b1580/upvote')
            .set({'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3Q0MDAwMEBzanN1LmNvbSIsInVzZXJfaWQiOiI1Y2NmYTEyY2ZjOTk3Njc3ZjFhYTA4YmQiLCJpYXQiOjE1NTcxMzIyODB9.XfPhLw8THWftJvr4iiEvf2guuTTH2Yv2vF-QvHUUFSA'})
            .end(function(err, res) {
                console.log("Mocha test -- upvote:")
                console.log(res.body)
            });
    });
    
    it('GET /search/user/test40000',function(){
        agent.get('/search/user/test40000')
            .set({'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3Q0MDAwMEBzanN1LmNvbSIsInVzZXJfaWQiOiI1Y2NmYTEyY2ZjOTk3Njc3ZjFhYTA4YmQiLCJpYXQiOjE1NTcxMzIyODB9.XfPhLw8THWftJvr4iiEvf2guuTTH2Yv2vF-QvHUUFSA'})
            .end(function(err, res) {
                console.log("Mocha test -- search user:")
                console.log(res.body)
            });
    });

    it('GET /search/question/question',function(){
        agent.get('/search/question/question')
            .set({'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3Q0MDAwMEBzanN1LmNvbSIsInVzZXJfaWQiOiI1Y2NmYTEyY2ZjOTk3Njc3ZjFhYTA4YmQiLCJpYXQiOjE1NTcxMzIyODB9.XfPhLw8THWftJvr4iiEvf2guuTTH2Yv2vF-QvHUUFSA'})
            .end(function(err, res) {
                console.log("Mocha test -- search question:")
                console.log(res.body)
            });
    });

    it('GET /search/topic/08',function(){
        agent.get('/search/topic/08')
            .set({'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3Q0MDAwMEBzanN1LmNvbSIsInVzZXJfaWQiOiI1Y2NmYTEyY2ZjOTk3Njc3ZjFhYTA4YmQiLCJpYXQiOjE1NTcxMzIyODB9.XfPhLw8THWftJvr4iiEvf2guuTTH2Yv2vF-QvHUUFSA'})
            .end(function(err, res) {
                console.log("Mocha test -- search topic:")
                console.log(res.body)
            });
    });

    it('GET /questions/5cd0b395a2bcc65d0481ddee',function(){
        agent.get('/questions/5cd0b395a2bcc65d0481ddee')
            .set({'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3Q0MDAwMEBzanN1LmNvbSIsInVzZXJfaWQiOiI1Y2NmYTEyY2ZjOTk3Njc3ZjFhYTA4YmQiLCJpYXQiOjE1NTcxMzIyODB9.XfPhLw8THWftJvr4iiEvf2guuTTH2Yv2vF-QvHUUFSA'})
            .end(function(err, res) {
                console.log("Mocha test -- fetch question:")
                console.log(res.body)
            });
    });

    it('GET /userTopics',function(){
        agent.get('/userTopics')
            .set({'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3Q0MDAwMEBzanN1LmNvbSIsInVzZXJfaWQiOiI1Y2NmYTEyY2ZjOTk3Njc3ZjFhYTA4YmQiLCJpYXQiOjE1NTcxMzIyODB9.XfPhLw8THWftJvr4iiEvf2guuTTH2Yv2vF-QvHUUFSA'})
            .end(function(err, res) {
                console.log("Mocha test -- get user topics:")
                console.log(res.body)
            });
    });

    it('GET /userFeed',function(){
        agent.get('/userFeed')
            .set({'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3Q0MDAwMEBzanN1LmNvbSIsInVzZXJfaWQiOiI1Y2NmYTEyY2ZjOTk3Njc3ZjFhYTA4YmQiLCJpYXQiOjE1NTcxMzIyODB9.XfPhLw8THWftJvr4iiEvf2guuTTH2Yv2vF-QvHUUFSA'})
            .end(function(err, res) {
                console.log("Mocha test -- get user feed:")
                console.log(res.body)
            });
    });

    it('GET /profile/5ccfa12cfc997677f1aa08bd',function(){
        agent.get('/profile/5ccfa12cfc997677f1aa08bd')
            .set({'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3Q0MDAwMEBzanN1LmNvbSIsInVzZXJfaWQiOiI1Y2NmYTEyY2ZjOTk3Njc3ZjFhYTA4YmQiLCJpYXQiOjE1NTcxMzIyODB9.XfPhLw8THWftJvr4iiEvf2guuTTH2Yv2vF-QvHUUFSA'})
            .end(function(err, res) {
                console.log("Mocha test -- get profile:")
                console.log(res.body)
            });
    });

    it('GET /answer/5ccfe10025f0565300627180/owner',function(){
        agent.get('/answer/5ccfe10025f0565300627180/owner')
            .set({'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3Q0MDAwMEBzanN1LmNvbSIsInVzZXJfaWQiOiI1Y2NmYTEyY2ZjOTk3Njc3ZjFhYTA4YmQiLCJpYXQiOjE1NTcxMzIyODB9.XfPhLw8THWftJvr4iiEvf2guuTTH2Yv2vF-QvHUUFSA'})
            .end(function(err, res) {
                console.log("Mocha test -- get answer's owner:")
                console.log(res.body)
            });
    });
})