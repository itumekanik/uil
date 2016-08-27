UIL.Fps = function( o ){

    UIL.Proto.call( this, o );

    this.round = Math.round;

    this.autoHeight = true;

    this.baseH = this.h;
    this.hplus = 50;

    this.res = o.res || 40;
    this.l = 1;

    this.pa1 = [];
    this.pa2 = [];
    this.pa3 = [];

    var i = this.res+1;
    while(i--){
        this.pa1.push(50);
        this.pa2.push(50);
        this.pa3.push(50);
    }

    this.c[1].textContent = 'FPS';
    this.c[0].style.cursor = 'pointer';
    this.c[0].style.pointerEvents = 'auto';

    var panelCss = 'display:none; left:10px; top:'+ this.h + 'px; height:'+(this.hplus - 8)+'px; background: rgba(0, 0, 0, 0.2);' + 'border:1px solid rgba(255, 255, 255, 0.2); '

    this.c[2] = UIL.DOM( null, 'path', UIL.BASIC + panelCss , { fill:'rgba(200,200,200,0.3)', 'stroke-width':1, stroke:this.fontColor, 'vector-effect':'non-scaling-stroke' });

    this.c[2].setAttribute('viewBox', '0 0 '+this.res+' 42' );
    this.c[2].setAttribute('height', '100%' );
    this.c[2].setAttribute('width', '100%' );
    this.c[2].setAttribute('preserveAspectRatio', 'none' );

    UIL.DOM(null, 'path', null, { fill:'rgba(255,255,0,0.3)', 'stroke-width':1, stroke:'#FF0', 'vector-effect':'non-scaling-stroke' }, this.c[2] );
    UIL.DOM(null, 'path', null, { fill:'rgba(0,255,255,0.3)', 'stroke-width':1, stroke:'#0FF', 'vector-effect':'non-scaling-stroke' }, this.c[2] );


    // bottom line
    this.c[3] = UIL.DOM( null, 'div', UIL.BASIC + 'width:100%; bottom:0px; height:1px; background: rgba(255, 255, 255, 0.2);');

    this.isShow = o.show || false;

    this.now = ( self.performance && self.performance.now ) ? self.performance.now.bind( performance ) : Date.now;
    this.startTime = this.now()
    this.prevTime = this.startTime;
    this.frames = 0

    this.isMem = false;

    this.ms = 0;
    this.fps = 0;
    this.mem = 0;
    this.mm = 0;

    if ( self.performance && self.performance.memory ) this.isMem = true;

    this.c[0].events = [ 'click', 'mousedown', 'mouseover', 'mouseout' ];

    this.init();

}

UIL.Fps.prototype = Object.create( UIL.Proto.prototype );
UIL.Fps.prototype.constructor = UIL.Fps;

UIL.Fps.prototype.handleEvent = function( e ) {

    e.preventDefault();
    switch( e.type ) {
        case 'click': this.click(e); break;
        case 'mouseover': this.mode(1); break;
        case 'mousedown': this.mode(2); break;
        case 'mouseout':  this.mode(0); break;
    }

}

UIL.Fps.prototype.click = function( e ){

    if( this.isShow ) this.hide();
    else this.show();

};

UIL.Fps.prototype.mode = function( mode ){

    var s = this.s;

    switch(mode){
        case 0: // base
            s[1].color = this.fontColor;
            s[1].background = 'none';
        break;
        case 1: // over
            s[1].color = '#FFF';
            s[1].background = UIL.SELECT;
        break;
        case 2: // edit / down
            s[1].color = this.fontColor;
            s[1].background = UIL.SELECTDOWN;
        break;

    }
}

UIL.Fps.prototype.makePath = function ( point ) {

    var p = '';
    p += 'M ' + (-1) + ' ' + 50;
    for ( var i = 0; i < this.res + 1; i ++ ) { p += ' L ' + i + ' ' + point[i]; }
    p += ' L ' + (this.res + 1) + ' ' + 50;

    return p;

};

UIL.Fps.prototype.drawGraph = function( ){

    var svg = this.c[2];

    this.pa1.shift();
    this.pa1.push( 8.5 + this.round( ( 1 - (this.fps / 100)) * 30 ) );

    UIL.setSvg( svg, 'd', this.makePath( this.pa1 ), 0 );

    this.pa2.shift();
    this.pa2.push( 8.5 + this.round( ( 1 - (this.ms / 200)) * 30 ) );

    UIL.setSvg( svg, 'd', this.makePath( this.pa2 ), 1 );

    if ( this.isMem ) {

        this.pa3.shift();
        this.pa3.push( 8.5 + this.round( ( 1 - this.mm) * 30 ) );

        UIL.setSvg( svg, 'd', this.makePath( this.pa3 ), 2 );

    }

}


UIL.Fps.prototype.show = function(){

    this.h = this.hplus + this.baseH;


    if( this.parentGroup !== null ){ this.parentGroup.calc( this.hplus );}
    else if( this.isUI ) this.main.calc( this.hplus );

    this.s[0].height = this.h +'px';
    this.s[2].display = 'block'; 
    this.isShow = true;

    UIL.addListen( this );

}

UIL.Fps.prototype.hide = function(){

    this.h = this.baseH;

    if( this.parentGroup !== null ){ this.parentGroup.calc( -this.hplus );}
    else if( this.isUI ) this.main.calc( -this.hplus );
    
    this.s[0].height = this.h +'px';
    this.s[2].display = 'none';
    this.isShow = false;

    UIL.removeListen( this );
    this.c[1].textContent = 'FPS';
    
}

UIL.Fps.prototype.rSize = function(){

    this.s[0].width = this.width + 'px';
    this.s[1].width = this.width + 'px';
    this.s[2].left = 10 + 'px';
    this.s[2].width = (this.width-20) + 'px';
    
}

//////////////////

UIL.Fps.prototype.begin = function(){

    this.startTime = this.now();
    
}

UIL.Fps.prototype.end = function(){


    var time = this.now();
    this.ms = time - this.startTime;

    this.frames ++;

    if ( time > this.prevTime + 1000 ) {

        this.fps = this.round( ( this.frames * 1000 ) / ( time - this.prevTime ) );

        this.prevTime = time;
        this.frames = 0;

        if ( this.isMem ) {

            var heapSize = performance.memory.usedJSHeapSize;
            var heapSizeLimit = performance.memory.jsHeapSizeLimit;

            this.mem = this.round( heapSize * 0.000000954 );

            this.mm = heapSize / heapSizeLimit;

        }

    }

    this.drawGraph();
    this.c[1].innerHTML = 'FPS ' + this.fps + ' . <font color="yellow"> MS '+ ( this.ms | 0 ) + '</font> . <font color="cyan"> MB '+ this.mem + '</font>';

    return time;

    
}

UIL.Fps.prototype.listening = function(){

    this.startTime = this.end();
    
}