/**
 * @param {number[]} arr
 * @param {number} k
 * @return {number}
 */
var findKthPositive = function(arr, k) {
    let pt=0,i;
        for(i = 1 ;i <= 2000 && k ;i++){
            if(pt < arr.length && arr[pt] == i){
                pt++;
                continue;
            }
            k--;
        }
        return i-1;
};
