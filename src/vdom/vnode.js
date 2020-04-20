export class VNode{
    constructor(tag, data={}, children=[], text='', elm, context){
        this.tag=tag;
        this.props=data ;
        this.children=children;
        this.text=text
        this.key = data && data.key
        var count = 0;
        children.forEach(child => {
            if(child instanceof VNode){
                count+=child.count;
            }
            count++;
        });
        this.count = count;
    }
}