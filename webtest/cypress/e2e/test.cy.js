describe('Authentication', () => {
    it('passesLogin', () => {
        cy.login('dani@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');
    })

    it('failsByEmail', () => {
        cy.login('dan@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/login');
        cy.get('.error').should('contain', "Incorrect email");
    })

    it('failsByPassword', () => {
        cy.login('dani@gmail.com', 'abcABC123');
        cy.url().should('eq', 'http://localhost:3000/login');
        cy.get('.error').should('contain', "Incorrect password");
    })

    it('failsByEmptyEmail', () => {
        cy.login(' ', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/login');
        cy.get('.error').should('contain', "All fields must be filled");
    })

    it('passesRegister', () => {
        cy.signup('pelda@gmail.com', 'pelda', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');
    })

    it('failsRegisterEmailAlreadyInUse', () => {
        cy.signup('dani@gmail.com', 'pelda', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/signup');
        cy.get('.error').should('contain', "Email already in use");
    })

    it('failsRegisterUsernameAlreadyInUse', () => {
        cy.signup('pelda2@gmail.com', 'dani', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/signup');
        cy.get('.error').should('contain', "Username already in use");
    })

    it('failsRegisterEmailIsNotValid', () => {
        cy.signup('pelda2@gmail', 'dani', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/signup');
        cy.get('.error').should('contain', "Email not valid");
    })

    it('failsRegisterPasswordIsNotStrongEnough', () => {
        cy.signup('pelda2@gmail.com', 'pelda2', 'abcABC123');
        cy.url().should('eq', 'http://localhost:3000/signup');
        cy.get('.error').should('contain', "Password not strong enough");
    })

    it('passLogout', () => {
        cy.login('dani@gmail.com', 'abcABC123.');
        cy.get('button').click();
        cy.url().should('include', 'http://localhost:3000/login');
    })
});

describe('CRUD with events', () => {

    it('passCreateEvent', () => {
        cy.login('dani@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        cy.get('[href="/sportevents"]').click();
        cy.get('.event-name').type('New Test Event - Real - Barca');
        cy.get('.event-desc').type('Focimeccs: Real Madrid - FC Barcelona');
        cy.get('.event-date').type('2025-10-15T20:00');
        cy.get('.create > button').click();
        cy.get('.page').should('contain', 'New Test Event - Real - Barca').and('contain', 'Focimeccs: Real Madrid - FC Barcelona')
    })
    it('failCreateEventMissingData', () => {
        cy.login('dani@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        cy.get('[href="/sportevents"]').click();
        cy.get('.event-name').type('New Test Event - Bayern vs Dortmund');
        cy.get('.event-date').type('2025-10-15T20:00');
        cy.get('.create > button').click();
        cy.get('.page').should('contain', 'Please fill in all the fields')
    })
    it('passUpdateEvent', () => {
        cy.login('dani@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        cy.get('[href="/sportevents"]').click();
        cy.get('.type-event').should('exist').then(($event) => {
            if ($event.length > 0) {
                cy.get('.type-event').first()
                    .parent()
                    .within(() => {
                        cy.get('.upd').click();
                    });
                cy.get('[value="New Test Event - Real - Barca"]').clear().type('Updated Test Event - Real - Barca');
                cy.get('[type="submit"]').click();
                cy.get('.type-event').first()
                    .parent()
                    .within(() => {
                        cy.get('h4').should('contain', 'Updated Test Event - Real - Barca');
                    });
            }
        })
    })
    it('passDeleteEvent', () => {
        cy.login('dani@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        let eventName;

        cy.get('[href="/sportevents"]').click();
        cy.get('.type-event').should('exist').then(($event) => {
            if ($event.length > 0) {
                cy.get('.type-event').first()
                    .parent()
                    .within(() => {
                        cy.get('h4').invoke('text').then((name) => {
                            eventName = name;
                        });
                        cy.get('.del').click();
                    });
                cy.then(() => {
                    cy.get('.type-event').first()
                        .parent()
                        .within(() => {
                            cy.get('h4').should('not.contain', eventName);
                        });
                });
            }
        })
    })
})


describe('CRUD with challenges', () => {

    it('passCreateEvent', () => {
        cy.login('dani@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        cy.get('[href="/challenges"]').click();
        cy.get('.chal-name').type('New Test Challenge - Run 2km for 10 days');
        cy.get('.chal-desc').type('Running challenge to keep in moving');
        cy.get('.chal-valid').type('2025-10-15T20:00');
        cy.get('.chal-toachive').type('10');
        cy.get('.create > button').click();
        cy.get('.page').should('contain', 'New Test Challenge - Run 2km for 10 days').and('contain', 'Running challenge to keep in moving')
    })
    it('failCreateEventMissingData', () => {
        cy.login('dani@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        cy.get('[href="/challenges"]').click();
        cy.get('.chal-name').type('New Test Challenge - Run 5km for 15 days');
        cy.get('.chal-valid').type('2025-10-15T20:00');
        cy.get('.chal-toachive').type('10');
        cy.get('.create > button').click();
        cy.get('.page').should('contain', 'Please fill in all the fields')
    })
    it('passUpdateChallenge', () => {
        cy.login('dani@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        cy.get('[href="/challenges"]').click();
        cy.get('.type-challenge').should('exist').then(($challenge) => {
            if ($challenge.length > 0) {
                cy.get('.type-challenge').first()
                    .parent()
                    .within(() => {
                        cy.get('.upd').click();
                    });
                cy.get('[value="New Test Challenge - Run 2km for 10 days"]').clear().type('Updated Test Challenge - Run 3km for 10 days');
                cy.get('[type="submit"]').click();
                cy.wait(2000);
                cy.get('.type-challenge').first()
                    .parent()
                    .within(() => {
                        cy.get('h4').should('contain', 'Updated Test Challenge - Run 3km for 10 days');
                    });
            }
        })
    })
    it('passDeleteEvent', () => {
        cy.login('dani@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        let challengetName;

        cy.get('[href="/challenges"]').click();
        cy.get('.type-challenge').should('exist').then(($challenge) => {
            if ($challenge.length > 0) {
                cy.get('.type-challenge').first()
                    .parent()
                    .within(() => {
                        cy.get('h4').invoke('text').then((name) => {
                            challengetName = name;
                        });
                        cy.get('.del').click();
                    });
                cy.then(() => {
                    cy.get('.type-challenge').first()
                        .parent()
                        .within(() => {
                            cy.get('h4').should('not.contain', challengetName);
                        });
                });
            }
        })
    })
})


describe('CRUD with workouts', () => {

    it('passCreateWorkout', () => {
        cy.login('david@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        cy.get('[href="/workouts"]').click();
        cy.get('.workout-title').type('New Test Workout - Bench Press');
        cy.get('.workout-load').type('10');
        cy.get('.workout-reps').type('10');
        cy.get('.create > button').click();
        cy.get('.page').should('contain', 'New Test Workout - Bench Press')
    })
    it('failCreateWorkoutNoPrivilege', () => {
        cy.login('pelda@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        cy.get('[href="/workouts"]').click();
        cy.url().should('include', 'http://localhost:3000');
    })
    it('failCreateWorkoutMissingData', () => {
        cy.login('david@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        cy.get('[href="/workouts"]').click();
        cy.get('.workout-title').type('New Test Workout - Squat');
        cy.get('.workout-load').type('100');
        cy.get('.create > button').click();
        cy.get('.page').should('contain', 'Please fill in all the fields')
    })
    it('passUpdateWorkout', () => {
        cy.login('david@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        cy.get('[href="/workouts"]').click();
        cy.get('.type-workout').should('exist').then(($workout) => {
            if ($workout.length > 0) {
                cy.get('.type-workout').first()
                    .parent()
                    .within(() => {
                        cy.get('.upd').click();
                    });
                cy.get('[value="New Test Workout - Bench Press"]').clear().type('Updated Test Challenge - Run 3km for 10 days');
                cy.get('[type="submit"]').click();
                cy.get('.type-workout').first()
                    .parent()
                    .within(() => {
                        cy.get('h4').should('contain', 'Updated Test Challenge - Run 3km for 10 days');
                    });
            }
        })
    })
    it('passDeleteWorkout', () => {
        cy.login('david@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        let workouttName;

        cy.get('[href="/workouts"]').click();
        cy.get('.type-workout').should('exist').then(($workout) => {
            if ($workout.length > 0) {
                cy.get('.type-workout').first()
                    .parent()
                    .within(() => {
                        cy.get('h4').invoke('text').then((name) => {
                            workouttName = name;
                        });
                        cy.get('.del').click();
                    });
                cy.then(() => {
                    cy.get('.type-workout').first()
                        .parent()
                        .within(() => {
                            cy.get('h4').should('not.contain', workouttName);
                        });
                });
            }
        })
    })
})

describe('Joining events', () => {

    it('passJoinToChallenge', () => {
        cy.login('pelda@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        cy.get('.type-challenge').should('exist').then(($challenge) => {
            if ($challenge.length > 0) {
                cy.get('.type-challenge').first()
                    .parent()
                    .within(() => {
                        cy.get('h4').invoke('text').as('challengeName');
                        cy.get('.add').click();
                    });
                cy.get('[href="/challenges"]').click();
                cy.get('@challengeName').then(name => {
                    cy.get('.page').should('contain', name);
                });
            } else {
                cy.log('Nincs elérhető kihívás az oldalon.');
            }
        });
    })


    it('passJoinToEvent', () => {
        cy.login('pelda@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        cy.get('.type-event').should('exist').then(($event) => {
            if ($event.length > 0) {
                cy.get('.type-event').first()
                    .parent()
                    .within(() => {
                        cy.get('h4').invoke('text').as('eventName');
                        cy.get('.add').click();
                    });
                cy.get('[href="/sportevents"]').click();
                cy.get('@eventName').then(name => {
                    cy.get('.page').should('contain', name);
                });
            } else {
                cy.log('Nincs elérhető sportesemény az oldalon.');
            }
        });
    })

    it('passUnsubscribeFromChallenge', () => {
        cy.login('pelda@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        cy.get('[href="/challenges"]').click();
        cy.url().should('include', 'http://localhost:3000/challenges');
        cy.get('.type-challenge').should('exist').then(($challenge) => {
            if ($challenge.length > 0) {
                cy.get('.type-challenge').first()
                    .parent()
                    .within(() => {
                        cy.get('h4').invoke('text').as('challengeName');
                        cy.get('.take-away-btn').click();
                    });
                cy.get('@challengeName').then(name => {
                    cy.get('.page').should('not.contain', name);
                });
            } else {
                cy.log('Nincs elérhető kihívás az oldalon.');
            }
        });
    })

    it('passUnsubscribeFromEvent', () => {
        cy.login('pelda@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        cy.get('[href="/sportevents"]').click();
        cy.url().should('include', 'http://localhost:3000/sportevents');
        cy.get('.type-event').should('exist').then(($event) => {
            if ($event.length > 0) {
                cy.get('.type-event').first()
                    .parent()
                    .within(() => {
                        cy.get('h4').invoke('text').as('eventName');
                        cy.get('.take-away-btn').click();
                    });
                cy.get('@eventName').then(name => {
                    cy.get('.page').should('not.contain', name);
                });
            } else {
                cy.log('Nincs elérhető sportesemény az oldalon.');
            }
        });
    })
});

describe('Request workout', () => {

    it('passRequestWorkout', () => {
        cy.login('pelda@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        let workoutName;

        cy.get('.type-workout').should('exist').then(($workout) => {
            if ($workout.length > 0) {
                cy.get('.type-workout').first()
                    .parent()
                    .within(() => {
                        cy.get('h4').invoke('text').then((name) => {
                            workoutName = name;
                        });
                        cy.get('.add').click();
                    });
                cy.get('button').click();
                cy.url().should('include', 'http://localhost:3000/login');
                cy.get('[type="email"]').type("david@gmail.com");//coach
                cy.get('[type="password"]').type("abcABC123.");
                cy.get('button').click();
                cy.url().should('eq', 'http://localhost:3000/');
                cy.get('[href="/notifications"]').click();
                cy.url().should('include', 'http://localhost:3000/notifications');
                cy.then(() => {
                    cy.get('.page').should('contain', `pelda érdeklődik a ${workoutName} edzésed iránt!`);
                });
            } else {
                cy.log('Nincs elérhető edzés az oldalon.');
            }
        });
    })
    it('passShareAdvice', () => {
        cy.login('david@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        cy.get('[href="/notifications"]').click();
        cy.url().should('include', 'http://localhost:3000/notifications');
        cy.get('.type-workout').should('exist').then(($workout) => {
            if ($workout.length > 0) {
                cy.get('.type-workout').first()
                    .parent()
                    .within(() => {
                        cy.get('.reply').click();
                    });
                cy.url().should('include', 'http://localhost:3000/advices');
                cy.get('input').type('Fuss többet, egyél kevesebb szénhidrátot!');
                cy.get('.create > button').click();
                cy.get('.page').should('contain', 'Fuss többet, egyél kevesebb szénhidrátot!');
            } else {
                cy.log('Nincs elérhető személyedzés kérelem az oldalon.');
            }
        });
    })

    it('passReplyWithMessageToAdvice', () => {
        cy.login('pelda@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        cy.get('[href="/notifications"]').click();
        cy.url().should('include', 'http://localhost:3000/notifications');
        cy.get('.type-advice').should('exist').then(($advice) => {
            if ($advice.length > 0) {
                cy.get('.type-advice').first()
                    .parent()
                    .within(() => {
                        cy.get('.reply').click();
                    });
                cy.url().should('include', 'http://localhost:3000/conversations');
                cy.get('input').type('Pontosan mennyi szénhidrátot egyek?');
                cy.get('.create > button').click();
                cy.wait(2000);
                cy.get('.page').should('contain', 'Pontosan mennyi szénhidrátot egyek?');
                cy.get('.delete-btn').click(); //a tesztelés egyszerűsítése érdekében
            } else {
                cy.log('Nincs elérhető edzés az oldalon.');
            }
        });
    })
});


describe('Getting notified by events', () => {
    it('joinToChallengeForTheTest', () => {
        cy.login('pelda@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        cy.get('.type-challenge').should('exist').then(($challenge) => {
            if ($challenge.length > 0) {
                cy.get('.type-challenge').first()
                    .parent()
                    .within(() => {
                        cy.get('h4').invoke('text').as('challengeName');
                        cy.get('.add').click();
                    });
                cy.get('[href="/challenges"]').click();
                cy.get('@challengeName').then(name => {
                    cy.get('.page').should('contain', name);
                });
            } else {
                cy.log('Nincs elérhető kihívás az oldalon.');
            }
        });
    })


    it('joinToEventForTheTest', () => {
        cy.login('pelda@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        cy.get('.type-event').should('exist').then(($event) => {
            if ($event.length > 0) {
                cy.get('.type-event').first()
                    .parent()
                    .within(() => {
                        cy.get('h4').invoke('text').as('eventName');
                        cy.get('.add').click();
                    });
                cy.get('[href="/sportevents"]').click();
                cy.get('@eventName').then(name => {
                    cy.get('.page').should('contain', name);
                });
            } else {
                cy.log('Nincs elérhető sportesemény az oldalon.');
            }
        });
    })

    it('passAchivedChallenge', () => {
        cy.login('pelda@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        let challengeName;
        let targetToAchieve;

        cy.get('[href="/challenges"]').click();

        cy.get('.type-challenge').should('exist').then(($challenge) => {
            if ($challenge.length > 0) {
                cy.get('.type-challenge').first()
                    .parent()
                    .within(() => {
                        cy.get('p.to-achive').invoke('text').then((text) => {
                            targetToAchieve = text;
                        });
                        cy.get('h4').invoke('text').then((name) => {
                            challengeName = name;
                        });
                        cy.get('.edit').click();
                    });
                cy.get('input').clear().type('7');
                cy.get('[type="submit"]').click();

                cy.log('Target to achieve:', targetToAchieve);

                cy.get('[href="/notifications"]').click();
                cy.wait(2000);
                cy.then(() => {
                    cy.get('.page').should('contain', `Gratulálok! Teljesítetted a(z) "${challengeName}" kihívást!`);
                });

            };
        });
    });

    it('passEventHasResult', () => {
        cy.login('pelda@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        let eventName;
        let result;

        cy.get('[href="/sportevents"]').click();

        cy.get('.type-event').should('exist').then(($event) => {
            if ($event.length > 0) {
                cy.get('.type-event')
                    .first()
                    .parent()
                    .within(() => {
                        cy.get('p.result').invoke('text').then((text) => {
                            result = text;
                        });
                        cy.get('h4').invoke('text').then((name) => {
                            eventName = name;
                        });
                        cy.get('.edit').click();
                    });
                cy.get('input').clear().type('1 - 1');
                cy.get('[type="submit"]').click();

                cy.get('nav > div > button').click();
                cy.login('dani@gmail.com', 'abcABC123.');
                cy.url().should('eq', 'http://localhost:3000/');

                cy.then(() => {
                    cy.get('.page')
                        .contains(eventName)
                        .parent()
                        .within(() => {
                            cy.get('.add').click();
                        });
                });
                cy.get('[href="/sportevents"]').click();
                cy.then(() => {
                    cy.get('.page')
                        .contains(eventName)
                        .parent()
                        .within(() => {
                            cy.get('.upd').click();
                        });
                    cy.get('.edit-result').clear().type('1 - 1').invoke('val').then((value) => {
                        result = value;
                        cy.get('[type="submit"]').click();
                    });
                });

                cy.get('nav > div > button').click();
                cy.login('pelda@gmail.com', 'abcABC123.');
                cy.url().should('eq', 'http://localhost:3000/');
                cy.get('[href="/notifications"]').click();
                cy.wait(2000);
                cy.then(() => {
                    cy.get('.page').should('contain', `A(z) "${eventName}" esemény eredménye: ${result}. Eltaláltad a tippet!`);
                });

            };
        });
    });

});

describe('Sending message', () => {
    it('startConversation', () => {
        cy.login('pelda@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        cy.get('.type-challenge').should('exist').then(($challenge) => {
            if ($challenge.length > 0) {
                cy.wait(3000);
                cy.get('.member-name').contains('testuser').click();
                cy.get('.send-message-btn').click();
                cy.get('input').clear().type('Hello, this is a test message!');
                cy.get('.create > button').click();
                cy.get('.page').should('contain', 'Hello, this is a test message!');
            };
            cy.get('.create').click();

            cy.get('nav > div > button').click();

            cy.login('test@gmail.com', 'abcABC123.');
            cy.url().should('eq', 'http://localhost:3000/');

            cy.get('[href="/conversations"]').click();
            cy.get('.conversation-partner').should('exist').then(($partners) => {
                if ($partners.length > 0) {
                    cy.wait(3000);
                    cy.get('.conversation-partner').contains('pelda').first()
                        .parent()
                        .within(() => {
                            cy.get('.message-text').should('contain', 'Hello, this is a test message!');
                            cy.get('.reply-form > input').type('Hello, this is a reply!');
                            cy.get('.reply-form > button').click();
                            cy.wait(1000);
                            cy.get('.message-text').should('contain', 'Hello, this is a reply!');
                            cy.get('.toggle-view-btn').click();
                            cy.get('.all-messages').first().should('contain', 'Hello, this is a test message!').and('contain', 'Hello, this is a reply!');
                        });
                } else {
                    cy.log('Nincs partnered');
                }
            });
        })
    })
    it('failStartingConversationAlreadyExist', () => {
        cy.login('pelda@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        cy.get('.type-challenge').should('exist').then(($challenge) => {
            if ($challenge.length > 0) {
                cy.wait(3000);
                cy.get('.member-name').contains('testuser').click();
                cy.get('.send-message-btn').click();
                cy.get('input').clear().type('Hello, this is a test message!');
                cy.get('.create > button').click();
                cy.get('.error').should('contain', 'Conversation already exists');
            };
        })
    })
    it('failStartingConversationAlreadyExist', () => {
        cy.login('test@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        cy.get('[href="/conversations"]').click();
        cy.wait(3000);
        cy.get('.conversation-partner').should('exist').then(($partners) => {
            cy.log('Partners:', $partners.length);
            if ($partners.length > 0) {

                cy.get('.conversation-partner').contains('pelda').first()
                    .parent()
                    .within(() => {
                        cy.get('.delete-btn').click();
                        cy.wait(1000);
                    });
                cy.get('.page').should('not.contain', 'Hello, this is a reply!').and('not.contain', 'pelda');
            } else {
                cy.log('Nincs partnered');
            }
        });
    })
})

describe('Editing profiles', () => {

    it('passEditingOurOwnProfile', () => {
        cy.login('pelda@gmail.com', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        cy.get('.type-challenge').should('exist').then(($challenge) => {
            if ($challenge.length > 0) {
                cy.get('.type-challenge').first()
                    .parent()
                    .within(() => {
                        cy.get('.add').click();
                    });
            }
        })

        cy.get('img').click();
        cy.get('.edit-profile-btn').click();
        cy.get('.username').clear().type('peldapelda');
        cy.get('.edit-form > .email').clear().type('peldapelda@gmail.com');
        cy.get('.intro').clear().type('I am a test user!');
        cy.get('.favsport').clear().type('Boxing, Futball');
        cy.get('.lastchal').clear().type('-');
        cy.get('.nextevent').clear().type('Real Madrid vs Barcelona');
        cy.get('.edit-form > button').click();
        cy.then(() => {
            cy.wait(3000);
            cy.get('.usernametop').should('contain', 'peldapelda')
            cy.get('.email').should('contain', 'peldapelda@gmail.com')
        })
    })

    it('passEditingOtherProfileWithAdminPrivilege', () => {
        cy.login('dani@gmail.com', 'abcABC123.');//admin
        cy.url().should('eq', 'http://localhost:3000/');

        cy.get('.type-challenge').should('exist').then(($challenge) => {
            if ($challenge.length > 0) {
                cy.wait(2000);
                cy.get('.type-challenge').first()
                    .parent()
                    .within(() => {
                        cy.get('.member-name').contains('peldapelda').click();
                    })
            };
            cy.get('.edit-profile-btn').click();
            cy.get('.username').clear().type('pelda');
            cy.get('.edit-form > .email').clear().type('pelda@gmail.com');
            cy.get('.intro').clear().type('I am a test user!');
            cy.get('.favsport').clear().type('Futball');
            cy.get('.lastchal').clear().type('-');
            cy.get('.nextevent').clear().type('Eger vs Szeged');
            cy.get('.edit-form > button').click();
            cy.then(() => {
                cy.get('.usernametop').should('contain', 'pelda')
                cy.get('.email').should('contain', 'pelda@gmail.com')
            })
        })
    })
})

describe('Deleting profiles', () => {
    it('passDeletingOurOwnProfile', () => {
        cy.signup('delete@gmail.com', 'delete', 'abcABC123.');
        cy.url().should('eq', 'http://localhost:3000/');

        cy.get('img').click();
        cy.get('.delete-profile-btn').click();
        cy.wait(2000);

        cy.login('delete@gmail.com', 'abcABC123.');
        cy.get('.error').should('contain', "Incorrect email");
    })

    it('passDeletingOtherProfileWithAdminPrivilege', () => {
        cy.login('dani@gmail.com', 'abcABC123.');//admin
        cy.url().should('eq', 'http://localhost:3000/');

        cy.get('.type-challenge').should('exist').then(($challenge) => {
            if ($challenge.length > 0) {
                cy.wait(3000);
                cy.get('.member-name').contains('pelda').click();
                cy.get('.delete-profile-btn').click();
            };
            cy.get('h1').click();
            cy.get('button').click();
            cy.wait(3000);
            cy.login('pelda@gmail.com', 'abcABC123.');
            cy.get('.error').should('contain', "Incorrect email");
        })
    })
})