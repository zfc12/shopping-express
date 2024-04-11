var express = require('express');
const {login, register} = require('../controller/user')
const {SuccessModel, ErrorModel} = require('../model/resModel')

var router = express.Router();

router.post('/login', function (req, res, next) {
    const { phone, password } = req.body;
    login(phone, password).then(response => {
        if (response) {
            // 自动同步 req.session 到 redis 中
            req.session.uid = response.uid;

            // set(req.sessionId, req.session);
            res.json(new SuccessModel({token: response.uid}));
            return;
        }
        res.json(new ErrorModel('登录失败'));
    })
});


router.post('/register', function (req, res, next) {
    const { username, password, phone } = req.body;
    register(username, password, phone).then(() => {
      res.json(new SuccessModel());
    }).catch(err => {
      res.json(new ErrorModel('注册失败'));
    })
})


router.post('/logout', function (req, res, next) {
  req.session.destroy(err => {
    if (err) {
      res.json(new ErrorModel('退出失败'));
    } else {
      res.json(new SuccessModel());
    }
  });
});

router.get('/login-test', (req, res, next) => {
    if (req.session.uid) {
        res.json({
            errno: 0,
            msg: '已登录'
        })
    } else {
        res.json({
            errno: -1,
            msg: '未登录'
        })
    }
})

module.exports = router;
