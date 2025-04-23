1. jest和playwright复用一套代码
2. 所以在单元测试编写时还是有点区别
   1. test分为evaluate和assert两个部分
   2. 两个方法的入参和返回值都需要可序列化
   3. 尽量不使用闭包，如果必须要使用的话，请添加到evaluate的返回值中
   4. 用到的外部数据（例如enum-plus、config、data）等，需要考虑到浏览器端，需要编译到e2e目录中
