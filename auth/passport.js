//passport.js for fb and google auth
//importing the requirements for passportfb and passportgoogle
const GithubStrategy = require('passport-github2').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require("../models/user.model");

const Google_Email = (passport)=>{
    const GOOGLE_CLIENT_ID = "471660212929-56slqnk260nnk7snhn8e34sh3o4rpequ.apps.googleusercontent.com";//"287120196822-sheo1ch0ejobbsbgtuhd7689asd01aue.apps.googleusercontent.com";
    const GOOGLE_CLIENT_SECRET = "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";//"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";
    passport.use(new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "https://playcryptidweb.azurewebsites.net/auth/google/callback"
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await User.findOne({ OAuthID: profile.id });
        
                if (!user) {
                    user = new User({
                        OAuthID: profile.id,
                        emails: profile.emails.map(email => email.value),
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

const Github_Email = (passport)=>{
GITHUB_CLIENT_ID = "Ov23liIefbbuV1FBRc19";
    GITHUB_CLIENT_SECRET = "00a6ef40f316471edca18854f7dff1b73fbbe60c";
    passport.use(new GithubStrategy({
        clientID: GITHUB_CLIENT_ID,
        clientSecret: GITHUB_CLIENT_SECRET,
        callbackURL: "https://playcryptidweb.azurewebsites.net/auth/github/callback"
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
    Github_Email
}
