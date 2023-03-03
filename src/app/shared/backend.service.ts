import {Injectable} from "@angular/core"
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { FirebaseError } from "@angular/fire/app";



@Injectable({
    providedIn:"root"
})
export default class BackendService{

    constructor(private storage:AngularFireStorage,private auth:AngularFireAuth,private afs:AngularFirestore){}

    async uploadImage(img){
        let ref = this.storage.ref(`profile/${img.name}`)
        try {
            const res = await ref.put(img);
            return await res.ref.getDownloadURL();
        } catch (e) {
            console.log(e);
            throw e.code;
        }
    }

    async signUp(img,user){
        return this.auth.createUserWithEmailAndPassword(user.value.email, user.value.pass).then((res) => {
            return this.createUser({ id: res.user.uid, name: user.value.name, email: user.value.email, profile: img });
        }).catch((e) => {
            throw e.code;
        });
    }

    async login(email,password){
        return this.auth.signInWithEmailAndPassword(email,password).then((res)=>{
            console.log(res);
            let usrCol = this.afs.doc(`user/${res.user.uid}`)
            try {
                usrCol.get().subscribe((res)=>{
                    console.log(res.data());
                    localStorage.setItem("user",JSON.stringify(res.data()))  
                })            
                return res;
            } catch (e) {
                console.log(e);
                throw e.code
            }
        }).catch((e)=>{
            throw e.code;
        })
    }



    async createUser(user:{id:string,name:string,email:string,profile}){
        const path = await this.uploadImage(user.profile);
        user.profile = path
        let userCollection = this.afs.doc(`user/${user.id}`)
        try {
            const res = await userCollection.set(user);
            console.log(res);
            localStorage.setItem("user",JSON.stringify(user))
            return user.id;
        } catch (e) {
            console.log(e);
            throw e
        }
    }
}