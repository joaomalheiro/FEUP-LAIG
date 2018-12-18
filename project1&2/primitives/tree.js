class MyTree extends CFGobject {
    constructor(scene,th,tb,ch,cb,nt,tm) {
        this.scene = scene;
        this.th = th;
        this.tb = tb;
        this.ch = ch;
        this.cb = cb;
        this.nt = nt;
        this.tm = tm;

        this.cone = MyCylinder(scene,th,tb,0,20,20);
        this.triangles = [];
        
        for(let i=0;i < nt;i++){
            let triangle = MyTriangle(scene,-cb / 2,0,0,cb / 2,0,0,0,0,ch);
            this.triangles.push(triangle);
        }
    }

}

display() {
    return null;
}