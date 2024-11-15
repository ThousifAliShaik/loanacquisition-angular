"use strict";(self.webpackChunkdemo=self.webpackChunkdemo||[]).push([[262],{6262:(E,o,i)=>{i.r(o),i.d(o,{UserListComponent:()=>b});var c=i(177),u=i(7681),e=i(4438),l=i(6557);const d=t=>["/admin/users",t];function m(t,F){if(1&t){const s=e.RV6();e.j41(0,"tr")(1,"td"),e.EFF(2),e.k0s(),e.j41(3,"td"),e.EFF(4),e.k0s(),e.j41(5,"td")(6,"span",9),e.EFF(7),e.k0s()(),e.j41(8,"td")(9,"span"),e.EFF(10),e.k0s()(),e.j41(11,"td")(12,"button",10),e.EFF(13," Edit "),e.k0s(),e.j41(14,"button",11),e.bIt("click",function(){const n=e.eBV(s).$implicit,a=e.XpG();return e.Njj(a.toggleUserStatus(n))}),e.EFF(15),e.k0s()()()}if(2&t){const s=F.$implicit;e.R7$(2),e.JRh(s.username),e.R7$(2),e.JRh(s.email),e.R7$(3),e.JRh(s.role),e.R7$(2),e.HbH("badge "+(s.isActive?"bg-success":"bg-danger")),e.R7$(),e.SpI(" ",s.isActive?"Active":"Inactive"," "),e.R7$(2),e.Y8G("routerLink",e.eq3(12,d,s.userId)),e.R7$(2),e.AVh("btn-danger",s.isActive)("btn-success",!s.isActive),e.R7$(),e.SpI(" ",s.isActive?"Disable":"Enable"," ")}}let b=(()=>{class t{constructor(s){this.userManagementService=s,this.users=[]}ngOnInit(){this.loadUsers()}loadUsers(){this.userManagementService.getUsers().subscribe(s=>this.users=s)}toggleUserStatus(s){this.userManagementService.toggleUserStatus(s.username,s.isActive?"disable_user":"enable_user").subscribe({next:n=>{if("User disabled !!"===n||"User enabled !!"===n){const a=this.users.findIndex(g=>g.username===s.username);-1!==a&&(this.users[a].isActive=!this.users[a].isActive)}else console.error("Unexpected response:",n)},error:n=>{console.error("Error toggling user status:",n)}})}static{this.\u0275fac=function(r){return new(r||t)(e.rXU(l.G))}}static{this.\u0275cmp=e.VBU({type:t,selectors:[["app-user-list"]],standalone:!0,features:[e.aNF],decls:25,vars:1,consts:[[1,"container-fluid"],[1,"d-flex","justify-content-between","align-items-center","mb-4"],["routerLink","/admin/users/new",1,"btn","btn-primary"],[1,"bi","bi-person-plus"],[1,"card"],[1,"card-body"],[1,"table-responsive"],[1,"table","table-hover"],[4,"ngFor","ngForOf"],[1,"badge","bg-info"],[1,"btn","btn-sm","btn-primary","me-2",3,"routerLink"],[1,"btn","btn-sm",3,"click"]],template:function(r,n){1&r&&(e.j41(0,"div",0)(1,"div",1)(2,"h2"),e.EFF(3,"User Management"),e.k0s(),e.j41(4,"button",2),e.nrm(5,"i",3),e.EFF(6," Add User "),e.k0s()(),e.j41(7,"div",4)(8,"div",5)(9,"div",6)(10,"table",7)(11,"thead")(12,"tr")(13,"th"),e.EFF(14,"Username"),e.k0s(),e.j41(15,"th"),e.EFF(16,"Email"),e.k0s(),e.j41(17,"th"),e.EFF(18,"Role"),e.k0s(),e.j41(19,"th"),e.EFF(20,"Status"),e.k0s(),e.j41(21,"th"),e.EFF(22,"Actions"),e.k0s()()(),e.j41(23,"tbody"),e.DNE(24,m,16,14,"tr",8),e.k0s()()()()()()),2&r&&(e.R7$(24),e.Y8G("ngForOf",n.users))},dependencies:[c.MD,c.Sq,u.iI,u.Wk],encapsulation:2})}}return t})()}}]);