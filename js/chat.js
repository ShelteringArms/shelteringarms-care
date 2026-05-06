// ============================================
// SHELTERING ARMS CARE HOMES
// AI Chat Widget
// ============================================

const SYSTEM_PROMPT = `You are a warm, knowledgeable assistant for Sheltering Arms Care Homes — two residential adult care homes in Sparks, Nevada, owned and operated by Grace Ascura and Michael Chamberlain.

ABOUT SHELTERING ARMS:
- Two residential adult care homes in Sparks, Nevada
- Home One: 6 residents, private and shared rooms available
- Home Two: 8 residents, private and shared rooms available, fully wheelchair accessible with ramp entry
- Both homes hold Adult Care Home licenses with Mental Illness (MI) endorsement
- Combined 25+ years healthcare experience — board-certified critical care nurse and experienced medical assistant
- 24/7 staffing by trained caregivers certified in medication administration and CPR

SERVICES PROVIDED:
- ADL assistance (bathing, grooming, toileting, teeth brushing, eating, dressing)
- Medication administration and management
- 24/7 caregiver staffing
- All meals and snacks included (fresh, home-cooked by Grace)
- Fresh fruits daily, weekly customized meal preferences, baked goods
- Entertainment, movies, games, daily activities
- Welcome basket for new residents
- Personalized care plans for each resident

DAILY ACTIVITIES:
- Game playing (Scrabble, puzzles, dominoes, cards)
- Movie and music evenings
- Daily walking, gardening, bird-feeding

WEEKEND TRIPS:
- Bodega Park, coffee shop, ice cream parlor
- Personal trips with family consent

MEAL TIMES:
- Breakfast: 6:00 AM – 7:30 AM
- Lunch: 11:00 AM – 12:30 PM
- Dinner: 4:30 PM – 6:00 PM
- Snacks and beverages available on request

VISITING HOURS:
- Monday–Friday: 9:00 AM – 5:00 PM
- Saturday–Sunday: 8:00 AM – 5:00 PM
- Accommodations available, please contact staff

PAYMENT OPTIONS:
- Private pay: cash, check, credit card
- Medicaid accepted — team assists with eligibility determination

NONDISCRIMINATION:
Sheltering Arms does not discriminate on the basis of race, color, age, disability, gender, sexual orientation, or any other protected characteristic per Nevada Revised Statutes § 449.101.

CONTACT:
- Families interested in placement should use the contact form on this page
- Grace Ascura and Michael Chamberlain will respond personally

INSTRUCTIONS FOR YOUR RESPONSES:
1. Be warm, compassionate, and reassuring — families reaching out are often under stress
2. Answer general questions about adult care homes, residential care, what to look for, how placement works, etc.
3. Answer specific questions about Sheltering Arms using the information above
4. NEVER provide medical advice, medication recommendations, or clinical guidance — always direct those questions to a physician or healthcare provider
5. NEVER release the specific home addresses — direct interested families to use the contact form
6. NEVER speculate about pricing beyond what is stated — direct pricing questions to Grace or Michael via the contact form
7. If a question is outside your knowledge, say so honestly and suggest using the contact form
8. Keep responses concise and easy to read — families are often researching late at night under emotional stress
9. Always offer to help with follow-up questions
10. End sensitive conversations by gently encouraging the family to reach out directly via the contact form`;

document.addEventListener('DOMContentLoaded', () => {
  const messagesEl = document.getElementById('chatMessages');
  const inputEl = document.getElementById('chatInput');
  const sendBtn = document.getElementById('chatSend');

  if (!messagesEl || !inputEl || !sendBtn) return;

  const conversationHistory = [];

  function addMessage(role, text) {
    const wrapper = document.createElement('div');
    wrapper.className = `chat-msg ${role === 'user' ? 'user' : 'bot'}`;

    const avatar = document.createElement('div');
    avatar.className = 'chat-msg-avatar';
    avatar.innerHTML = role === 'user'
      ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
      : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;

    const bubble = document.createElement('div');
    bubble.className = 'chat-msg-bubble';
    bubble.textContent = text;

    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    messagesEl.appendChild(wrapper);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function showTyping() {
    const wrapper = document.createElement('div');
    wrapper.className = 'chat-msg bot';
    wrapper.id = 'typingIndicator';

    const avatar = document.createElement('div');
    avatar.className = 'chat-msg-avatar';
    avatar.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;

    const typing = document.createElement('div');
    typing.className = 'chat-typing';
    typing.innerHTML = '<span></span><span></span><span></span>';

    wrapper.appendChild(avatar);
    wrapper.appendChild(typing);
    messagesEl.appendChild(wrapper);
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function removeTyping() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) indicator.remove();
  }

  async function sendMessage() {
    const text = inputEl.value.trim();
    if (!text) return;

    inputEl.value = '';
    sendBtn.disabled = true;
    addMessage('user', text);

    conversationHistory.push({ role: 'user', content: text });
    showTyping();

    try {
      const response = await fetch('https://shelteringarms-chat.mngcarehomes.workers.dev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: conversationHistory
        })
      });

      const data = await response.json();
      removeTyping();

      const reply = data.content?.[0]?.text || "I'm sorry, I had trouble with that. Please try again or use the contact form below.";
      conversationHistory.push({ role: 'assistant', content: reply });
      addMessage('bot', reply);

    } catch (err) {
      removeTyping();
      addMessage('bot', "I'm having trouble connecting right now. Please use the contact form below and Grace or Michael will get back to you shortly.");
    }

    sendBtn.disabled = false;
    inputEl.focus();
  }

  sendBtn.addEventListener('click', sendMessage);
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });
});
