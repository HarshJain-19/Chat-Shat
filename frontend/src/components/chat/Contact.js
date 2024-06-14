import { useState, useEffect } from "react";
import { getUser } from "../../services/ChatService";
import UserLayout from "../layouts/UserLayout";

export default function Contact({ chatRoom, onlineUsersId, currentUser }) {
  const [contact, setContact] = useState(null);
  const [fetchedContacts, setFetchedContacts] = useState(new Set());

  useEffect(() => {
    const contactId = chatRoom.members?.find(
      (member) => member !== currentUser.uid
    );

    if (fetchedContacts.has(contactId)) {
      // Contact already fetched, no need to fetch again
      return;
    }

    const fetchData = async () => {
      try {
        const res = await getUser(contactId);
        setContact(res);
        setFetchedContacts((prev) => new Set(prev.add(contactId)));
      } catch (error) {
        console.error("Error fetching contact:", error);
      }
    };

    fetchData();
  }, [chatRoom, currentUser, fetchedContacts]);

  return contact ? (
    <UserLayout user={contact} onlineUsersId={onlineUsersId} />
  ) : null;
}
