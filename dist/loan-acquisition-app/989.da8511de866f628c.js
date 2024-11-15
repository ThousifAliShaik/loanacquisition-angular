"use strict";(self.webpackChunkdemo=self.webpackChunkdemo||[]).push([[989],{7989:(f,d,a)=>{a.r(d),a.d(d,{DashboardComponent:()=>v});var o=a(177),l=a(7681),m=a(4512),t=a(4438),u=a(7673);let p=(()=>{class s{getDashboardMetrics(){return(0,u.of)([{label:"Total Applications",value:"156",icon:"bi bi-file-text"},{label:"Under Review",value:"43",icon:"bi bi-hourglass-split"},{label:"Approved",value:"98",icon:"bi bi-check-circle"},{label:"Assigned to You",value:"15",icon:"bi bi-person"}])}getRecentApplications(){return(0,u.of)([{id:"APP001",applicant:"John Doe",status:"Under Review",statusClass:"bg-warning",assignedTo:"Sarah Wilson"},{id:"APP002",applicant:"Jane Smith",status:"Approved",statusClass:"bg-success",assignedTo:"Mike Johnson"},{id:"APP003",applicant:"Robert Brown",status:"Pending",statusClass:"bg-info",assignedTo:"Emily Davis"}])}static{this.\u0275fac=function(i){return new(i||s)}}static{this.\u0275prov=t.jDH({token:s,factory:s.\u0275fac,providedIn:"root"})}}return s})();function b(s,n){if(1&s&&(t.j41(0,"div",2)(1,"div",3)(2,"div",4)(3,"div",5)(4,"div")(5,"h6",6),t.EFF(6),t.k0s(),t.j41(7,"h2",7),t.EFF(8),t.k0s()(),t.nrm(9,"i"),t.k0s()()()()),2&s){const e=n.$implicit;t.R7$(6),t.JRh(e.label),t.R7$(2),t.JRh(e.value),t.R7$(),t.HbH(e.icon+" fs-1 text-primary opacity-25")}}let h=(()=>{class s{constructor(e){this.dashboardService=e,this.metrics=[]}ngOnInit(){this.dashboardService.getDashboardMetrics().subscribe(e=>this.metrics=e)}static{this.\u0275fac=function(i){return new(i||s)(t.rXU(p))}}static{this.\u0275cmp=t.VBU({type:s,selectors:[["app-dashboard-metrics"]],standalone:!0,features:[t.aNF],decls:2,vars:1,consts:[[1,"row"],["class","col-md-3 mb-4",4,"ngFor","ngForOf"],[1,"col-md-3","mb-4"],[1,"card","h-100"],[1,"card-body"],[1,"d-flex","justify-content-between","align-items-center"],[1,"card-subtitle","mb-2","text-muted"],[1,"card-title","mb-0"]],template:function(i,r){1&i&&(t.j41(0,"div",0),t.DNE(1,b,10,4,"div",1),t.k0s()),2&i&&(t.R7$(),t.Y8G("ngForOf",r.metrics))},dependencies:[o.MD,o.Sq],encapsulation:2})}}return s})();var c=a(223);function F(s,n){if(1&s&&(t.j41(0,"a",13),t.nrm(1,"i"),t.EFF(2),t.k0s()),2&s){const e=n.$implicit,i=t.XpG();t.AVh("active",e.route===i.currentRoute),t.Y8G("routerLink",e.route),t.R7$(),t.HbH(e.icon),t.R7$(),t.SpI(" ",e.label," ")}}function g(s,n){if(1&s&&(t.j41(0,"tr")(1,"td"),t.EFF(2),t.k0s(),t.j41(3,"td"),t.EFF(4),t.k0s(),t.j41(5,"td")(6,"span"),t.EFF(7),t.k0s()(),t.j41(8,"td"),t.EFF(9),t.k0s(),t.j41(10,"td")(11,"button",14),t.EFF(12,"View"),t.k0s(),t.j41(13,"button",15),t.EFF(14,"Edit"),t.k0s()()()),2&s){const e=n.$implicit;t.R7$(2),t.JRh(e.id),t.R7$(2),t.JRh(e.applicant),t.R7$(2),t.HbH("badge "+e.statusClass),t.R7$(),t.SpI(" ",e.status," "),t.R7$(2),t.JRh(e.assignedTo)}}let v=(()=>{class s{constructor(e){this.dashboardService=e,this.menuItems=[],this.currentRoute="/",this.recentApplications=[]}ngOnInit(){this.userRole=this.getUserRoleFromLocalStorage(),this.setMenuItems(),this.loadRecentApplications()}getUserRoleFromLocalStorage(){const e=localStorage.getItem("currentUser");return e?JSON.parse(e).role:c.g.LOAN_OFFICER}setMenuItems(){switch(this.userRole){case c.g.ADMIN:this.menuItems=[{label:"User Management",route:"/admin/users",icon:"bi bi-person"}];break;case c.g.LOAN_OFFICER:this.menuItems=[{label:"Dashboard",route:"/",icon:"bi bi-speedometer2"}];break;default:this.menuItems=[]}}loadRecentApplications(){this.dashboardService.getRecentApplications().subscribe(e=>this.recentApplications=e)}static{this.\u0275fac=function(i){return new(i||s)(t.rXU(p))}}static{this.\u0275cmp=t.VBU({type:s,selectors:[["app-dashboard"]],standalone:!0,features:[t.aNF],decls:29,vars:2,consts:[[1,"container","mt-4"],[1,"row"],[1,"col-md-3"],[1,"list-group"],["class","list-group-item list-group-item-action",3,"routerLink","active",4,"ngFor","ngForOf"],[1,"col-md-9"],[1,"mb-4"],[1,"card","mt-4"],[1,"card-header"],[1,"card-body"],[1,"table-responsive"],[1,"table"],[4,"ngFor","ngForOf"],[1,"list-group-item","list-group-item-action",3,"routerLink"],[1,"btn","btn-sm","btn-primary","me-2"],[1,"btn","btn-sm","btn-secondary"]],template:function(i,r){1&i&&(t.j41(0,"div",0)(1,"div",1)(2,"div",2)(3,"div",3),t.DNE(4,F,3,6,"a",4),t.k0s()(),t.j41(5,"div",5)(6,"h2",6),t.EFF(7,"Dashboard"),t.k0s(),t.nrm(8,"app-dashboard-metrics"),t.j41(9,"div",7)(10,"div",8),t.EFF(11," Recent Applications "),t.k0s(),t.j41(12,"div",9)(13,"div",10)(14,"table",11)(15,"thead")(16,"tr")(17,"th"),t.EFF(18,"ID"),t.k0s(),t.j41(19,"th"),t.EFF(20,"Applicant"),t.k0s(),t.j41(21,"th"),t.EFF(22,"Status"),t.k0s(),t.j41(23,"th"),t.EFF(24,"Assigned To"),t.k0s(),t.j41(25,"th"),t.EFF(26,"Actions"),t.k0s()()(),t.j41(27,"tbody"),t.DNE(28,g,15,6,"tr",12),t.k0s()()()()()()()()),2&i&&(t.R7$(4),t.Y8G("ngForOf",r.menuItems),t.R7$(24),t.Y8G("ngForOf",r.recentApplications))},dependencies:[o.MD,o.Sq,l.iI,l.Wk,m.UN,h],encapsulation:2})}}return s})()}}]);