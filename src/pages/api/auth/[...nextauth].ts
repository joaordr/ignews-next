import { query as q } from 'faunadb';

import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { fauna } from '../../../services/fauna';

export default NextAuth({
    secret: process.env.JWT_SECRET,
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            authorization: {
                params: {
                    scope: 'read:user',
                },
            },
        }),
    ],
    callbacks: {
        session: async ({ session }) => {
            try {
                const userActiveSubscription = await <any>fauna.query(
                    q.Get(
                        q.Match(
                            q.Index('subscription_status_by_email_2'),
                            q.Casefold(session.user.email)
                        )
                    )
                )

                return { ...session, activeSubscription: userActiveSubscription.data.status === 'active' ? true : false };
            } catch (error) {
                console.log(error.message)
                return { ...session, activeSubscription: false }
            }
        },
        async signIn({ user, account, profile, credentials }) {
            try {
                const { email } = user;
                await fauna.query(
                    q.If(
                        q.Not(
                            q.Exists(
                                q.Match(
                                    q.Index('user_by_email'),
                                    q.Casefold(email)
                                )
                            )
                        ),
                        q.Create(
                            q.Collection('users'),
                            { data: { email } }
                        ),
                        q.Get(
                            q.Match(
                                q.Index('user_by_email'),
                                q.Casefold(email)
                            )
                        )
                    )
                )

                return true;
            } catch (error) {
                console.log(error);
                return '';
            }

        }
    }
})