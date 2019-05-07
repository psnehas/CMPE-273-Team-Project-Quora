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
                console.log(res)
            });
    });

    // it('GET /profile',function(){
    //     agent.get('/profile')
    //         .query({uid: 31})
    //         .headers({'Authorization':'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRlc3Q0MDAwMEBzanN1LmNvbSIsInVzZXJfaWQiOiI1Y2NmYTEyY2ZjOTk3Njc3ZjFhYTA4YmQiLCJpYXQiOjE1NTcxMzIyODB9.XfPhLw8THWftJvr4iiEvf2guuTTH2Yv2vF-QvHUUFSA'})
    //         .then(function(res){
    //             expect(res.body.count).to.be.a('Object');
    //         });
    // });

    // it('GET /user_courses',function(){
    //     agent.get('/user_courses/31')
    //         .then(function(res){
    //             expect(res.body.count).to.be.a('Object');
    //         });
    // });

    // it('POST //signin',function(){
    //     agent.post('/login')
    //         .then(function(res){
    //             expect(res.status).to.equal(400);
    //         });
    // });

    // it('GET /course_info',function(){
    //     agent.get('/course_info/1')
    //         .then(function(res){
    //             expect(res.body.count).to.be.a('Object');
    //         });
    // });

    // it('GET /load_announcements',function(){
    //     agent.get('/load_announcements/1')
    //         .then(function(res){
    //             expect(res.body.count).to.be.a('Object');
    //         });
    // });
})