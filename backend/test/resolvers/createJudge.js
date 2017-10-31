import { graphql } from 'graphql';
import { expect } from 'chai'
import schema  from '../../schema';
import sequelize from '../../config/sequelize';
import User from '../../models/user';
import JudgeMutation from '../../resolvers/mutations/createJudge'

describe('Judge creation resolver', function () {
    before(function(done) {
        sequelize.sync({force: true}).then(() => done());
    });
    after(function () {
        sequelize.close();
    });

    it('does not allow duplicate usernames', (done) => {
        const input = { input: {
            username: "user1",
            firstName: "Jane",
            lastName: "Doe",
        }}
        User.create({
            username: 'user1',
            firstName: 'john',
            lastName: 'smith',
            type: 'ADMIN'
        })
        .then(() => JudgeMutation.createJudge("",input))
        .then((ignore) => {
            done(ignore) 
        }, (err) => {
            expect(err).to.exist
            expect(err.name).to.equal('SequelizeUniqueConstraintError')
            done()
        });
    });

    it('does not allow null values', (done) => {
        const input = { input: { username: "user2"}}
        JudgeMutation.createJudge("",input)
        .then((ignore) => {
            done(ignore) 
        }, (err) => {
            expect(err).to.exist
            expect(err.message).to.equal('notNull Violation: user.firstName cannot be null,\nnotNull Violation: user.lastName cannot be null')
            done()
        });
    });

    it('changes the user type to judge if a student with the same username already exists', (done) => {
        const input = { input: {
            username: "user3",
            firstName: "Adam",
            lastName: "Savage",
        }}
        User.create({
            username: 'user3',
            firstName: 'Adam',
            lastName: 'Savage',
            type: 'STUDENT'
        })
        .then(() => JudgeMutation.createJudge("",input))
        .then((result) => {
            console.log()
            expect(result.dataValues.username).to.equal('user3');            
            expect(result.dataValues.type).to.equal('JUDGE');
            done();
        }, (err) => {
            done(err)
        });
    });
});