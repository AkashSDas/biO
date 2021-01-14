const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

const db = admin.firestore();

// to aggregate the heart count
exports.aggregateHearCount = functions.firestore
  .document("hearts/{heartId}")
  .onWrite(async (doc, context) => {
    const heartId = context.params.heartId;

    // since the structure of heartId is like profileId_userId
    // we can get the profileId in which we will add/update a fields
    // named heartCount
    const [profileId, userId] = heartId.split("_");
    const profileRef = db.collection("users").doc(profileId);

    await db.runTransaction(async (transaction) => {
      const profileDoc = await transaction.get(profileRef);

      // to see if the profile is unhearted
      if (!doc.exists) {
        const newHeartCount = profileDoc.data().heartCount - 1;
        transaction.update(profileRef, { heartCount: newHeartCount });
      } else {
        const newHeartCount = profileDoc.data().heartCount + 1;
        transaction.update(profileRef, { heartCount: newHeartCount });
      }
    });
  });
