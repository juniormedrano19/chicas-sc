import test from 'node:test';
import assert from 'node:assert/strict';
import { contactSchema } from '../src/features/contact/schema.ts';
import { matchSchema } from '../src/features/matches/schema.ts';
const valid={name:'  Ana  ',email:'ANA@example.com',message:'Quiero conocer al grupo.',consent:true,website:''};
test('contact normalizes names and email before persistence',()=>{
 const value=contactSchema.parse(valid);
 assert.equal(value.name,'Ana');assert.equal(value.email,'ana@example.com');
});
test('contact rejects missing consent and bot honeypot',()=>{
 assert.equal(contactSchema.safeParse({...valid,consent:false}).success,false);
 assert.equal(contactSchema.safeParse({...valid,website:'https://spam.example'}).success,false);
});
test('contact rejects malformed email, empty messages and oversized payload fields',()=>{
 for(const input of [{email:'invalid'},{message:'  '},{message:'a'.repeat(2001)},{name:'a'.repeat(81)}]) assert.equal(contactSchema.safeParse({...valid,...input}).success,false);
});
test('match contract rejects negative scores and invalid timestamps',()=>{
 const match={id:'1',opponent:'Visitante',played_at:'2026-08-01T20:00:00Z',home:true,goals_for:2,goals_against:0,competition:'Liga'};
 assert.equal(matchSchema.safeParse(match).success,true);
 assert.equal(matchSchema.safeParse({...match,goals_for:-1}).success,false);
 assert.equal(matchSchema.safeParse({...match,played_at:'not-a-date'}).success,false);
});
