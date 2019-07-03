var models  = require('../models');
var express = require('express');
var md5 = require('md5');
const  jwt  =  require('jsonwebtoken');
const  bcrypt  =  require('bcryptjs'); 
var router = express.Router();
var cors = require('cors')
var cookieParser = require('cookie-parser')



router.use(cors())
router.use(cookieParser())

router.post('/', function(req, res) {

    var images = [
        "https://cdn1.iconfinder.com/data/icons/avatars-55/100/avatar_profile_user_music_headphones_shirt_cool-512.png",
        "http://cdn3.iconfinder.com/data/icons/avatars-15/64/_Bearded_Man-17-512.png",
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAkFBMVEX///8AAADz8/MEBAT09PT+/v719fX9/f38/Pz39/f6+vr29vYDAwHs7Oytra3v7+/MzMzn5+ejo6N9fX2Xl5ff39/ExMSQkJBbW1thYWHS0tK7u7tPT0/c3Ny0tLQkJCQuLi5ERERpaWkTExM3NzdycnKHh4c8PDwcHBwSEhJFRUWLi4ukpKQmJiYyMjJubm5KJ79HAAAWO0lEQVR4nM1daWOjLBAGE+O1STQxl7naNEnTc///v3tFwAPlZvvWD1vbHWUemWGGmQEAwJfv924A70aZdnUcekjhvfZNt0mqKwzxr37rBv9P0NwEctqgc1PANW2NkvRp6VtA73V8Wh028RVH+M9+HOM/B3FM6KKQudGgLSBcyGjp6wAlqWlDLq0Om/iKEvxnP0rwn4MkIq0k5BUxvWnR+pQWsLSklRRCuC3/129eF3FeB2jTIPJktO2me2yGDG311mhMfpuMcSvheIKfjL2INktekVDa8Zi83EsAhzZGCOGoABMpbd20t/gbE1pu0zpsVjJLcZdMy5/0WFpvMsD0+nTMSqICVteGdrIIYPXe4xI+hV3aiNL2mx4PNd2lrWSWSm79aQLPFiD4KLvu+3DfYITwMBXQ4qbLFrP8FcKviQzgpGlaymYlxT4Ze/yx1wOYME9OvJ6IDjNNoVVSOir/OQ31YELfG8XAmz0j4secBdj7tg2bnO/VYrNCQqxGu1dsexAhHI3+tABCeJnHXH31ivxAPkfGAuSKqJzNgPYD86SCcEsBIoRdgGXv7Hu01eum6fJa93ehDFCDTfzbRC6iGgCRHnYB/il/blPUwISQBOXPbP/RoCuvtQzgAJuKABWYVtXB+8fiVCx7APHNbbFfjT3PW6WnfPlMaGqAJxagwbftsUk+jTMzAcArO8i0AA5c9f+M4Ay/hphssYgqsxmgH37kECB47g0yDcD6pkdSAnzfzxb5x/3297LbHq7L48QJwDhATl5iqYPx7T5br4jf8FyL3QAuPsBuJ7+mQR+ggQ5iWx/G0vFXpoNhNdh/7T4W6/kr5PWgAkBCeyobEHxbGZu1mQirYc0nkww7M3GhuHoKJgQ4+DG+Mkdmgri2xOLbuWrx5K+4V3R6cAiglUdJn+R9GiUzEYKdoFe0AC5sXTWWTfqb9Sh6cAMQrgMbV61Fm7QBunDVpi89V80EIFzit06PkZ0OEtrqkwRjJ67aHvKY1gFYzrXy2eLyeM4mFq5azWZl8YPE2Ex0aP2tA4D0564/L9fSQdJVIQro+HFk78mgVkgnWgIcEYATFyIaE4vvAmAckxmFE4BvGRt4MBsLicWnTAt0UGQmqp/pbHG/OgMIH3iiqOSqKWiS/NPwniw7Lsr2mx2sLzcAyx/fs9DUVetFS+QAeSI6Tz8vT5glF2aCof1eg8hKBxmABmYiphNdJ4Z+gHa7wg3ZeZScJxVdNbB35ckM0JbXJuA0LTUTNa2P/2wxiq4f8ulSPy6l+jGuhWYPsgCrWGmdIDAyE2F2lTH9RMNNOr1Nr/ucG4VU0SRkCoMo1n+ybehnEqZzLzlo92Dpn+6PWXZcL2ahOcAIW/yQeVLLVSvt1UHI9C1DDdw0Af6BR9JSzG9aaiaiyjHyWYB6PRiApYjp5wJMSBRcy6TAEW7aSXzaCiDuHS7TmybgUqcyFAeZDDjKMLAAtUR0DLJvAdPXYyu75OdaAOHWPvAg60E5wEkgHGQ+mAToQgcg6n95XFSkgw5EdMwMkV2mR+teAvRDzyk4hbymddj08Z8NEwQpH+DzlBmQ0HWDGgAhTB0AJBbfyEwg2uyNA/AGmgRoHYbwaRRA1a07CppWLCVAP2uLb5LimdJETJfpvEM7pkqTxAdFgJhktDJz1WraqCo5oRbfBGAQTbddgNXNHrR1sD0qeK8aACE8ryKryMqkyjwFFgDHYwD+9nplDQZElDjQqBfVZx7wkdkA9Gimrv2bug5WYgcmixcWYAoYM4FpydAPcuUeRJnj85z3baU62AVo1oPJPH/0epAB2OPIn2+UAY5wat9BDxrmkcH6tc1aLaLDOth88mRGay+kk+Odc4AaIlrRrpZdvZoBvg62kwnZbPcgQEQAkXtqOOkhtN26Nr1BhujV9N4CuAGDIsoCxCTH0/JwhszVBbgUe5RSHfTj4bo2DYChF3w2ALfDAFmO6vwgiOfZ8bRZ/j18v6CXfB2eYEcZMzsRZeraTEtOmoHjbTwoolyAlOnSrQrLKw7DSbRvAzzYAQwm3bo2bR0kTC/rkfGopIN8sUPmB5xaw+kW2JiJ8nWcujY9gCj7O+opjYKI8nL07429OMQ2Pcipa9MPTh4IwHMkNRODANl6pVMzrr4KssH/DmCP6VfC0dpQRFnaaW034Nuc9231ARrqILqesEHcqpkJeY4+btwBXI1ppoPOehB4hJljqGEmRHUygBjYryV1ICxElKlrM6rlILm1Q2vYUzYTwzn6PRbRM8jR4GVVmUjr2ixEFJAQGlxHFjrYbfqIXZunEMygb+LJNGx2stxmANcE4LlJS9voYEUSvlWj87WkmhV9h0sDYLeuzQRguHojCD8AAahhJrhFCO/V6PzsI6/OyqOsSHwLgHH0De/ZoUkzCEVUSQer6wOSmLDVIMNURZkB/HsP0VCDJWpoRm9U0hxi3/RmZyZcAJzsq55blgj/EoAORLSczE0qhEv/R3tw0CnA/3UvhXQGTF21weRLFTq4x1aTHtI0rmsz6kFKG6DZU2Huqg01XU3IcsD/tspshriuzUC4W2lWNN1ZOTETddMpsvhradMKAEldmw1AL1hB+DK3mS71mx4jhCv2YxiwSSy+7EmJnExLex8mtq5at+kt8bot17owdW0GPVhNl0qj+BSzddh2K1/C0hd8SkxdtYa2nUI0FNGKdge/6iWu9J1kHFTRQZ8u3fVJGShIktI1fTd11VTr2jSsbV5KKfrpHdf79elzkeebj3y2T4/jkpibFqE6uFrvT4t8k5fX536dFln1eb7hxVYH7QHWCyTX8BGB4/aFDX1C+Njm63gQYIA86uNs+d1/CF4XyMjm4P8GWM/ok/nbI8E1GbAdCqwZ/kinVA7rJXPecbHrwBq1H6qW8sd2OkhoffxnG4CTMbi8oFUz/Bw9fLucqogLXdRdLF95tFUeo2xsVEQuepBT16YR+alcteMXGt8FOXoE8rBZF3O0ZnR2oYFtbrJ0Ws4Mp+q5CVGNrz9U16ahg7VtAwcJ00MXlzYDY9oHVj3YzXIbiiihDQ5SgMP5wUHaLHGig6SuLTB4sh9VC24OAUJv4kIHaZ0950mBcA8lX3DFkxQgyhnKAUJg46r1rJn2pxmObK8VAD6lYE6W8Q2umKUAd4DbKwbmWvtJTvIlkgO8xOW4TQpuhaWXn6o9qF/XplFu1JvRv0IZQOKq7aW9fXQI0Md/thVRdG0kdTKl70poNxKAL741wJrN4bo2tVGUiarRrVq4g0zazCZeIFcHEe1S3Cs6bFa2PqCTFzMzQWnH3rcQ4AN9DPyWOhPAoU1diSjZ2yhkABpHfgoRwHKqUM/oJ5kQ4NLWTDT90Klrs9JBTHsSGfpV0mJkKwC4daaDtUep+qQ8Abpv1f8wAHdROyaz5gO8OdNByqbBk/zw8vHAAQjTbrzrmQfw5EwHhwEK7KBSjj4EazQz+tMDeAu6rytgbzhF1yb+FSIqiaoVtwdluAb45DGvq5dftAAeTr6waT2AhM1uXZuZmeiXck3Te6vYAEVrpr3XgfypTXK9zOgWUU5FNGDr2pRm9BKAOOjkZevPPM8Xs/1qOh0MqsfeNP3EEbZiThKhZskXAZud3VsszESbkbpWjZYzgQm/kp72ejIxM8EyNjt1bVZmwiD5osa0oYhSSO26Nkc6aLmfjFsdNKiKcpp8saqTUQs8tAA61kG7rK0jHaRsyp7kzOiBrQ7qrHyx8ih90oqFq1ZHtKy2HXOlgx4DENe18YOTaq7aKuky7UwHJ4UaQAGbnd1bdGb0HR1Mn9SZri7FXokfazNXrQHI1LWZmokCHgI3Wx51aMNnWFgGHhTr2qSu2goFCqmZsNpPpkNbTpOPsVaOqCdoFQkZUm3MxHxU72ptte1YlxYtATgm1oEHelm5aiGaLqVAz0zIxA5FVd8yHY9yuAd1APKnS9VEaOLUVVuhV55duMycVrRWvgRVQvcCHLpq4TcKAjxRWg1XjQXoD38aPVeNZEdnsbKZkPoYtypA8Fo1baWD0ro2NVeNFNfjmbyeJzPc9B6HN3IxQJGIEhJJXZvyjH6FYzJbfYDDve2R+M3U0FWT1bUpiWjX2b7ioNPM0XRpW8eGLSc9nd1b9Fw1ZjZxIrHBDLiY0S9IBG5taibYoYL7pPJ0qV6qtI0czOhLma8AfgVKkx4BmxKAOiXNId3A+9MeIIqHVzHUDdBy1RQBGq4+wwYaiWo2DFAjY/RBo+FTy1mdqogqRtV2JHP9PghQY0Zf0OzOLbAxE2yW20ZEMdMpjeHndiI6/qLpq0Jl2srvB9J0t67NwEw0tFcqXIXVZh3bOovhuxDRbl2bVVStWqCMszBzhlYn8Lup9wXH2+/ozeh7bA7XtRkGfiOccfozQlUlwo8h6EG6Eg5il1TXTPSEZ7CuzXTlS6vsq72xghbAVZ2Wg3spQK6r1k+hkN+MzESLNnlr7YtvYiZAdq4BfofDAI1yRMynMU++bJqU6D420MFps4EkPuvCzlWTAtRPvkxhc97Iif8xeADn3w3ARyQDqCmibpIvdTE76slcF+Dqq/X0ZpDWZMsNkuW20cHWEpwVZRGN+Fuvv++FQES7G7pHrnSQnkqmN6MnTA9E1cj5CFhWRzMCXcFVi5cdgEtjV41lkzmVTNtVY6NqRQtgeT2v2Y/BYXr21QEIV47MBK1rC+iT+q4aO6N/Z5YgbEM5wCnaTatTf7N1JaLdU8mcLFLeQ6bS6VV+MuABsnu3psDKVet7lORJFzl6rxkQCdOf0hDjjgX4Go9tZvQ8gGauGhuTiTcMQBx/E5qJHbvb14J7Bt1Q8kUZoJGr1mMkzLoAR/AgA+jTBV71CJWx0U27SQ9+0l2dzLYDkCAU5ejDHQOQLEXQSr7wAcrq2vTrZPZMOeUOSML8ZPeXeiEN7J8iqO+qNcscSV2byzoZZmTcSfMYuy5AyNAaBR5qgN26Njd1MpfuwLETiih6764NcFTtXutKB7tZbk0R5UW2w8/uwLHr2zZm7rjrLvqaDdJquWqMl8itazM7f7Cpw6fjhizVxiw+nQ4D1HDVekMFflJFuFUSoEHUHRm5AwcFuO4uZhslrkS0tmb6n0Y8cPjvXb3iiB0FOGNW6737djP6PpvkSYfllAd2MWUuAJizyxEPjly1mk1fFaDy8Xzhtbda9FYfSMkCvPXWW16TcV8HpckXvj9C6tqs95NpMZ31F4nC9/EgbXioxLhLewxp0zZmgrLJqWuzKaeM3wdWwcLrdADg9Lu/NngEn+POe1WSL3w2OXVtFjqYbc49gNXN+dgDeDwPACxvzptMDFBdB2Omrs3CVQPV9jRF5XYPAYTVtLYDMGUHJNhEQHYpEVU7M1Gzqfxp+DqYRCD5/IICpiE90JgAPAlp4dNnYgqwzyb7pIEnE4fHO1W54R6ENIRKAOYigPjn/QhiQfJFXZNkABXKKeP9AcoAoptbDfAmBkh89wPxh+z8EemTUh308hfIAcgyffCrQlu/5xQMAiyvl9yz1UFf0oNSM3Fs9qVRYPoV7d+FzsRQoKXuwpFmeYx6kN29RddMpGj01DnG6bwCq7MOwPLapsoAe2zGnbo2bTNxQlWXWgeplzex4segANHP172qoLEAO3VtKsmXGuAExJ+DHAmZRjdAEyC5+ZwGXDb51ow5lUxdB+NwvngzA3hA23/rA4TwbTHW7cH6Y8gA9oTbxwd3iABydy65A5pm0j4H8pHHQHBwE9+j5AHk6qC/eOFwJO1BVNOfGwIsr5dP4kMPmgmeue7+ptD3+7qewAAgTMPUGGB5ndeqbBqL6KouWjICCDOU7jcEiI/QWOmJaLeuTe6qfVB8ajrYc1O+JmB8tgFYXh+Rxokc3d1bpDP64gsO7Lui3oO4FPxgB7AU1aILUBB4YOvaJGbi3rRrBhBHtP9CK4Do512xB2WnknWFO3tXASjY4GpEZlDCzYgUP9whAyqBh+FTyTiuWir65KoAq72BaRWj3XnI60Aqomxdm1h7hXvPKAOERan1qQuAtOxKYYEOH2C7BxduAMKV78UrBwDRHxZigLIe7IYsZo4AvmWTBEzfOEzrDF7o35nKIjkW4LAOrpUAKjD9QJuAJA8XPYiudSxfoNPJcvN0cOoKIKz26F65AkjWPoh0kNa1SXygrRsRrTK8IZgOv05XRKvX7WQ9yNS1cdz0VuzWEmB5c35+c9WD6CYVA0y6p5Lxki87BYAOmdai3QlFlHsqWVd70WJAGUDVHnQHkJJ4Cts8i3UQCakOQBcDks7r0t42z6plXzVAcva2LkD9XjGihbNQDaDATY9zTiv/ow4235bsdCAVUfb0urb2kp3VfqMOInuxkfQgcyrZYHbppgzwh0bcTtM3CUByKpkwXPWsCvBHzQSlfR4S0WZxAHsq2aCTN/r3I6NxD5Z/Fukgs3sLz03/XTrYoxVGQisktK6NF1Gd/yod7NNmE7WqKP5MsuBnl35eRPu0MA14OshubsKbaJ108oM/q4Pof2hlYNLTwS5A/lSZrRf9VTqI/jCTiCipa+NPleMPDUb+D6/nQwywsvhBIghXsYXmvwvgH1wqLz+VTBTsuP4SgLwB/JVf/txkuYXRnIdCKz8AkEv7EIV6VU4li1QZ+d9mHvNxz0wMFg3xYgGrXwFQMIDDgleKLwNI+n7yrFRY8L/1IHz2eCKqBrC82Uk/4/8JcBcYAmx8oAkuLfhlPUhFFE+ARSJK6trE0Zz9b5nR93rwJAXIOZWMHX9XT9Q5tQXo9GM8FUAmopxTyfrhKu/iBqCUaR3ai1cD5JkJ9VPJInyG0a8yE580CSw9lUwacMSf5tiqCv0xEeXr4GsRahcNyabKAdkd8VeI6MdYo6ZmWET7wh2G6cu/ZFrDTDwKIHfVJD04LNzR8id7kCui9zgUsmkkonVV1BVyD8v5IR28FqC/8bRgNTz+s0bZbXN8in6vuKDN9SoTh08lE+0nMwbTy08A5JiJy1RvZ6buqWSCqTJTof8M9UKMbgCW84hUh00gr2vj9z3NKf4gQEi8UK1Vu8N1bSoLueJw8S8B9mkh3RNd73S4Vo5U/8yXOB9Bk6p7ox6Eozw2Y7O+dFdso2tKKvb/PcDHZmrOpvmTfhLGs7cfAPjyObdgs/ekgnB35GTfnM71b3TwsPfZDfxUdkeraXl1bdInm0qAYvmiybRiD5b/87I8gkDNo2TYpJDYU8mU+77VSgzGs0OLRzc9WHXfbGy4apc5lUxjHsIdyjI66jgD+MizTtNGAHVPJRNmQEDxgVMcLgBe76ly0yI2eXVt+gAJ7TGvxx0LHTzkR5IrEvagxlDhDCCqPZru73RdlHYPltf5vp9Xi9+lANXZxE/WW2PQPTrierMOWgmAwzoIRdKj7ZJMT8snBmDrhqt6T8vTVPjeks1+0302idZRNvGTERGLOrIY0puYzjziKFCmLQm8dHF5r4/rbLZupQD/wNb1eL8sUuK2WDYdsbT4t5DuFUXONGpuwuaGPBmztH0SmpEE09U6X16ukH9dd8t8vZqDJuYneq8Jm0Hzb+vGD/zeDUOiQkt+DyJvle5ni/y+vF22h+3ltryj4zvT1YQyJn6d3yXRY9P/D3mhIzU5S3vsAAAAAElFTkSuQmCC",
        "https://cdn1.iconfinder.com/data/icons/avatars-55/100/avatar_profile_user_cop_police_mustache_shades-512.png",
        ]
    var index = Math.floor(Math.random() * Math.floor(4));


  models.User.create({
    username: req.param('user')["username"],
    password : md5(req.param('user')["password"]),
    email:req.param('user')["email"],
    profileImage:images[index]
  })

  var Email = req.param('user')["email"];
  
  models.User.findOne({
      where : {
          email : Email
      }
  }).then(function(users) {
    res.send({ "user" : {
        "userID": users["id"],
        "username":users["username"],
        "createdAt":users["createdAt"],
        "email" : users["email"],
        "profileImgage":users["profileImage"]
    }})
    });
});


router.patch('/', function(req, res) {
    console.log(req.headers.authorization)
    if (req.headers.authorization) {
        var authorization = req.headers.authorization,
            decoded;
            if (authorization.startsWith('Bearer ')) {
                authorization = authorization.slice(7, authorization.length);
            }
            console.log(authorization)
        try {
            decoded = jwt.verify(authorization, SECRET_KEY);
        } catch (e) {
            return res.status(401).send('unauthorized');
        }
        var userId = decoded.id;
        console.log(userId)

        if(req.param('user')["username"] !=undefined)
        {
            models.User.update({
                username: req.param('user')["username"]
            },{where : {id: userId}}
            )
        }
        if(req.param('user')["password"] !=undefined)
        {
            models.User.update({
                password: md5(req.param('user')["password"]),
            },{where : {id: userId}}
            )
        }
        if(req.param('user')["profileImage"] !=undefined)
        {
            models.User.update({
                profileImage: req.param('user')["profileImage"],
            },{where : {id: userId}}
            )
        }

        models.User.findOne({where : {id: userId}}).then(function(user){
            return res.send(user);
        });
    }
    else{
        res.send("please login to continue")
    }
});

router.delete('/', function(req, res) {
    if (req.headers.authorization) {
        var authorization = req.headers.authorization,
            decoded;
            if (authorization.startsWith('Bearer ')) {
                authorization = authorization.slice(7, authorization.length);
            }
            console.log(authorization)
        try {
            decoded = jwt.verify(authorization, SECRET_KEY);
        } catch (e) {
            return res.status(401).send('unauthorized');
        }
        var userId = decoded.id;
        console.log(userId)

        models.User.destroy({where : {id: userId}}).then(function(user){
            return res.send("user deleted");
        });
    }
    else{
        res.send("please login to continue")
    }
});

router.get('/', function(req, res) {
    if (req.headers.authorization) {
        var authorization = req.headers.authorization,
            decoded;
            if (authorization.startsWith('Bearer ')) {
                authorization = authorization.slice(7, authorization.length);
            }
            console.log(authorization)
        try {
            decoded = jwt.verify(authorization, SECRET_KEY);
        } catch (e) {
            return res.status(401).send('unauthorized');
        }
        var userId = decoded.id;
        console.log(userId)
        
        models.User.findOne({where : {id: userId}}).then(function(user){
            if(user != null)
                return res.send(user);
            else    
                return res.send("no such user found")
        });
    }
    else{
        res.send("please login to continue")
    }
});

module.exports = router;
