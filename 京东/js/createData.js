function random(n, m) {
    return Math.round(Math.random() * (m - n) + n);
}

var area1 = "��Ǯ��������֣��������������������������ʩ�ſײ��ϻ���κ�ҽ�";
var area2 = "һ�����������߰˾�";

var ary = [];
for (var i = 0; i < 99; i++) {
    var obj = {};
    obj["id"] = i;
    obj["name"] = area1[random(0, 31)] + area2[random(0, 8)];
    obj["sex"] = random(0, 1);
    obj["score"] = random(59, 99);
    ary.push(obj);
}
console.log(JSON.stringify(ary));

