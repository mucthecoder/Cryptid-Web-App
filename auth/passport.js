const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../models/user.model");

const Google_Email = (passport)=>{
        const GOOGLE_CLIENT_ID = "471660212929-56slqnk260nnk7snhn8e34sh3o4rpequ.apps.googleusercontent.com";//"287120196822-sheo1ch0ejobbsbgtuhd7689asd01aue.apps.googleusercontent.com";//
        const GOOGLE_CLIENT_SECRET = "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";//"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";//
        passport.use(new GoogleStrategy({
            clientID: GOOGLE_CLIENT_ID,
            clientSecret: GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ OAuthID: profile.id });
        
                if (!user) {
                    user = new User({
                        OAuthID: profile.id,
                        email: profile.emails[0].value,
                        username: profile.displayName,
                        usertType:"user"
                    });
                    await user.save();
                }
        
                return done(null, user);
            } catch (error) {
                console.error('Error during Google OAuth:', error);
                return done(error, null);
            }
        }));
        

        passport.serializeUser((user, done) => {
            done(null, user.id);
        });

        passport.deserializeUser(async (id, done) => {
            try {
                const user = await User.findById(id);
                done(null, user);
            } catch (error) {
                done(error, null);
            }
        });
};

const Facebook_Email = (passport)=>{
    FACEBOOK_CLIENT_ID = "453961490558859";
    FACEBOOK_CLIENT_SECRET = "7ef3c13a5844b8bb493c04d029b5a7e7";
    passport.use(new FacebookStrategy({
        clientID: FACEBOOK_CLIENT_ID,
        clientSecret: FACEBOOK_CLIENT_SECRET,
        callbackURL: "/auth/facebook/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ OAuthID: profile.id });
    
            if (!user) {
                user = new User({
                    OAuthID: profile.id,
                    email: profile.emails[0].value,
                    username: profile.displayName,
                    usertType:"user"
                });
                await user.save();
            }
    
            return done(null, user);
        } catch (error) {
            console.error('Error during Facebook OAuth:', error);
            return done(error, null);
        }
    }));
    

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            console.log(id);
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
};

module.exports = {
    Google_Email,
    Facebook_Email
}
