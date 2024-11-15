"use strict";(self.webpackChunkdemo=self.webpackChunkdemo||[]).push([[842],{461:(M,g,a)=>{a.r(g),a.d(g,{LoginComponent:()=>h});var m=a(177),l=a(7681),o=a(4341),e=a(4438),c=a(8010);function p(r,f){if(1&r&&(e.j41(0,"div",18),e.EFF(1),e.k0s()),2&r){const t=e.XpG();e.R7$(),e.SpI(" ",t.errorMessage," ")}}function _(r,f){1&r&&e.nrm(0,"span",19)}let h=(()=>{class r{constructor(t,i){this.router=t,this.authService=i,this.credentials={username:"",password:""},this.loading=!1,this.errorMessage=""}ngOnInit(){this.authService.currentUserValue&&this.router.navigate(["/dashboard"])}onSubmit(){this.errorMessage="",this.loading=!0,this.authService.login(this.credentials).subscribe({next:()=>{this.router.navigate(["/dashboard"])},error:t=>{this.errorMessage=t,this.loading=!1,console.error("Login error:",t)}})}static{this.\u0275fac=function(i){return new(i||r)(e.rXU(l.Ix),e.rXU(c.u))}}static{this.\u0275cmp=e.VBU({type:r,selectors:[["app-login"]],standalone:!0,features:[e.aNF],decls:24,vars:6,consts:[["loginForm","ngForm"],[1,"container"],[1,"row","justify-content-center","mt-5"],[1,"col-md-6","col-lg-4"],[1,"card","shadow"],[1,"card-body"],[1,"text-center","mb-4"],[3,"ngSubmit"],[1,"mb-3"],["for","username",1,"form-label"],["type","text","id","username","name","username","required","",1,"form-control",3,"ngModelChange","ngModel"],["for","password",1,"form-label"],["type","password","id","password","name","password","required","",1,"form-control",3,"ngModelChange","ngModel"],["class","alert alert-danger","role","alert",4,"ngIf"],["type","submit",1,"btn","btn-primary","w-100",3,"disabled"],["class","spinner-border spinner-border-sm me-1",4,"ngIf"],[1,"text-center","mt-3"],["routerLink","/register"],["role","alert",1,"alert","alert-danger"],[1,"spinner-border","spinner-border-sm","me-1"]],template:function(i,n){if(1&i){const d=e.RV6();e.j41(0,"div",1)(1,"div",2)(2,"div",3)(3,"div",4)(4,"div",5)(5,"h2",6),e.EFF(6,"LAMS Login"),e.k0s(),e.j41(7,"form",7,0),e.bIt("ngSubmit",function(s){return e.eBV(d),s.preventDefault(),e.Njj(n.onSubmit())}),e.j41(9,"div",8)(10,"label",9),e.EFF(11,"Username"),e.k0s(),e.j41(12,"input",10),e.mxI("ngModelChange",function(s){return e.eBV(d),e.DH7(n.credentials.username,s)||(n.credentials.username=s),e.Njj(s)}),e.k0s()(),e.j41(13,"div",8)(14,"label",11),e.EFF(15,"Password"),e.k0s(),e.j41(16,"input",12),e.mxI("ngModelChange",function(s){return e.eBV(d),e.DH7(n.credentials.password,s)||(n.credentials.password=s),e.Njj(s)}),e.k0s()(),e.DNE(17,p,2,1,"div",13),e.j41(18,"button",14),e.DNE(19,_,1,0,"span",15),e.EFF(20),e.k0s(),e.j41(21,"div",16)(22,"a",17),e.EFF(23,"Don't have an account? Sign Up"),e.k0s()()()()()()()()}2&i&&(e.R7$(12),e.R50("ngModel",n.credentials.username),e.R7$(4),e.R50("ngModel",n.credentials.password),e.R7$(),e.Y8G("ngIf",n.errorMessage),e.R7$(),e.Y8G("disabled",n.loading||!n.credentials.username||!n.credentials.password),e.R7$(),e.Y8G("ngIf",n.loading),e.R7$(),e.SpI(" ",n.loading?"Logging in...":"Login"," "))},dependencies:[m.MD,m.bT,o.YN,o.qT,o.me,o.BC,o.cb,o.YS,o.vS,o.cV,l.iI,l.Wk],encapsulation:2})}}return r})()}}]);