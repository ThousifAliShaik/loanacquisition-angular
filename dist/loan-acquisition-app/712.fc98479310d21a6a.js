"use strict";(self.webpackChunkdemo=self.webpackChunkdemo||[]).push([[712],{5712:(b,o,i)=>{i.r(o),i.d(o,{LoanListComponent:()=>u});var e=i(177),r=i(7681),t=i(4438),c=i(1369);const l=s=>["/applications",s],p=s=>["/applications",s,"edit"];function d(s,E){if(1&s&&(t.j41(0,"tr")(1,"td"),t.EFF(2),t.k0s(),t.j41(3,"td"),t.EFF(4),t.k0s(),t.j41(5,"td"),t.EFF(6),t.nI1(7,"currency"),t.k0s(),t.j41(8,"td")(9,"span"),t.EFF(10),t.k0s()(),t.j41(11,"td"),t.EFF(12),t.nI1(13,"date"),t.k0s(),t.j41(14,"td")(15,"button",9),t.EFF(16," View "),t.k0s(),t.j41(17,"button",10),t.EFF(18," Edit "),t.k0s()()()),2&s){const n=E.$implicit,a=t.XpG();t.R7$(2),t.JRh(n.id),t.R7$(2),t.JRh(n.applicantName),t.R7$(2),t.JRh(t.bMT(7,9,n.loanAmount)),t.R7$(3),t.HbH("badge "+a.getStatusClass(n.status)),t.R7$(),t.SpI(" ",n.status," "),t.R7$(2),t.JRh(t.bMT(13,11,n.createdAt)),t.R7$(3),t.Y8G("routerLink",t.eq3(13,l,n.id)),t.R7$(2),t.Y8G("routerLink",t.eq3(15,p,n.id))}}let u=(()=>{class s{constructor(n){this.loanService=n,this.applications=[]}ngOnInit(){this.loadApplications()}loadApplications(){this.loanService.getApplications().subscribe(n=>this.applications=n)}getStatusClass(n){return{DRAFT:"bg-secondary",SUBMITTED:"bg-primary",UNDER_REVIEW:"bg-warning",PENDING_DOCUMENTS:"bg-info",APPROVED:"bg-success",REJECTED:"bg-danger"}[n]||"bg-secondary"}static{this.\u0275fac=function(a){return new(a||s)(t.rXU(c.a))}}static{this.\u0275cmp=t.VBU({type:s,selectors:[["app-loan-list"]],standalone:!0,features:[t.aNF],decls:27,vars:1,consts:[[1,"container-fluid"],[1,"d-flex","justify-content-between","align-items-center","mb-4"],["routerLink","/applications/new",1,"btn","btn-primary"],[1,"bi","bi-plus"],[1,"card"],[1,"card-body"],[1,"table-responsive"],[1,"table","table-hover"],[4,"ngFor","ngForOf"],[1,"btn","btn-sm","btn-primary","me-2",3,"routerLink"],[1,"btn","btn-sm","btn-secondary",3,"routerLink"]],template:function(a,F){1&a&&(t.j41(0,"div",0)(1,"div",1)(2,"h2"),t.EFF(3,"Loan Applications"),t.k0s(),t.j41(4,"button",2),t.nrm(5,"i",3),t.EFF(6," New Application "),t.k0s()(),t.j41(7,"div",4)(8,"div",5)(9,"div",6)(10,"table",7)(11,"thead")(12,"tr")(13,"th"),t.EFF(14,"ID"),t.k0s(),t.j41(15,"th"),t.EFF(16,"Applicant"),t.k0s(),t.j41(17,"th"),t.EFF(18,"Amount"),t.k0s(),t.j41(19,"th"),t.EFF(20,"Status"),t.k0s(),t.j41(21,"th"),t.EFF(22,"Created"),t.k0s(),t.j41(23,"th"),t.EFF(24,"Actions"),t.k0s()()(),t.j41(25,"tbody"),t.DNE(26,d,19,17,"tr",8),t.k0s()()()()()()),2&a&&(t.R7$(26),t.Y8G("ngForOf",F.applications))},dependencies:[e.MD,e.Sq,e.oe,e.vh,r.iI,r.Wk],encapsulation:2})}}return s})()}}]);