/*
    *Binary search is a search algorithm that is designed to search an element in a sorted array. This binary search is also a well-known example of the "divide and conquer approach".
*/

class Node{
    constructor(data){
        this.data = data
        this.children = []
    }
    
    add(data){//Given some data,create a new node and add it to the current node's 'children' array
        this.children.push(new Node(data))
    }
    
    remove(data){//Given some data,look at each child of the current node and remove any node with data === want_to_delete_data
        this.children = this.children.filter(node => {
            return node.data !== data
        })
    }

}   