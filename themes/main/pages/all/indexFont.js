app.use(express.static('public',{
    setHeaders:function(res,path){
        if(path.endsWith('woff2')){
            res.setHeaders('Content-Type', 'font/woff2')
        }
    }
}))