"use strict";(self.webpackChunkdemo=self.webpackChunkdemo||[]).push([[76],{8261:(d,l,o)=>{o.d(l,{X:()=>s});var s=function(e){return e.DRAFT="DRAFT",e.SUBMITTED="SUBMITTED",e.UNDER_REVIEW="UNDER_REVIEW",e.PENDING_DOCUMENTS="PENDING_DOCUMENTS",e.APPROVED="APPROVED",e.REJECTED="REJECTED",e}(s||{})},6557:(d,l,o)=>{o.d(l,{G:()=>n});var s=o(9437),e=o(8810),p=o(4438),u=o(1626);let n=(()=>{class c{constructor(t){this.http=t,this.baseUrl="localhost:8080/api/admin"}getUsers(){return this.http.get(`${this.baseUrl}/all_users`).pipe((0,s.W)(t=>(console.error("Error fetching users:",t),(0,e.$)(()=>new Error("Failed to fetch users")))))}getUserById(t){return this.http.get(`${this.baseUrl}/user/${t}`).pipe((0,s.W)(r=>(console.error("Error fetching user by ID:",r),(0,e.$)(()=>new Error("Failed to fetch user")))))}createUser(t){return this.http.post(`${this.baseUrl}/new_user`,{userId:void 0,username:t.username,email:t.email,fullName:t.fullName,phoneNumber:t.phoneNumber,role:{roleId:t.role.roleId,roleName:t.role.roleName},isActive:t.isActive}).pipe((0,s.W)(a=>(console.error("Error creating user:",a),(0,e.$)(()=>new Error("Failed to create user")))))}updateUser(t,r){return this.http.post(`${this.baseUrl}/update_user`,{...r,userId:t}).pipe((0,s.W)(a=>(console.error("Error updating user:",a),(0,e.$)(()=>new Error("Failed to update user")))))}toggleUserStatus(t,r){return this.http.put(`${this.baseUrl}/${r}`,null,{params:{username:t}})}getRoles(){return this.http.get(`${this.baseUrl}/all_roles`)}static{this.\u0275fac=function(r){return new(r||c)(p.KVO(u.Qq))}}static{this.\u0275prov=p.jDH({token:c,factory:c.\u0275fac,providedIn:"root"})}}return c})()},1369:(d,l,o)=>{o.d(l,{a:()=>u});var s=o(7673),e=o(8261),p=o(4438);let u=(()=>{class n{constructor(){this.mockApplications=[{id:"LOAN001",applicantName:"John Doe",applicantEmail:"john@example.com",loanAmount:25e4,purpose:"Home Purchase",status:e.X.UNDER_REVIEW,assignedUnderwriter:"Sarah Wilson",createdAt:new Date,updatedAt:new Date,documents:[],comments:[]}]}getApplications(){return(0,s.of)(this.mockApplications)}getApplicationById(i){return(0,s.of)(this.mockApplications.find(t=>t.id===i))}createApplication(i){const t={id:`LOAN${Math.floor(1e3*Math.random())}`,status:e.X.DRAFT,createdAt:new Date,updatedAt:new Date,documents:[],comments:[],...i};return this.mockApplications.push(t),(0,s.of)(t)}updateApplication(i,t){const r=this.mockApplications.findIndex(a=>a.id===i);if(-1!==r)return this.mockApplications[r]={...this.mockApplications[r],...t,updatedAt:new Date},(0,s.of)(this.mockApplications[r]);throw new Error("Application not found")}static{this.\u0275fac=function(t){return new(t||n)}}static{this.\u0275prov=p.jDH({token:n,factory:n.\u0275fac,providedIn:"root"})}}return n})()}}]);