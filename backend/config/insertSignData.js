require("dotenv").config();
const mongoose = require('mongoose');
const connectToDb = require('./connectToDb');
const PlanetarySign = require('../models/planetarySign');

const signData = [
    {
        sign: "Aries",
        planet: "North Node",
        meaning: "Having the North Node in Aries means your soul's journey is about developing self-reliance, courage, and independence. In this lifetime, you are meant to embrace your individuality and take bold steps towards asserting your personal identity. You are encouraged to move away from a tendency to rely on others and to cultivate your own strength and confidence. This placement pushes you to take initiative and be a pioneer in your own life, forging new paths and taking risks that lead to personal growth. In relationships, you are learning to balance your needs with those of others, developing a healthy sense of self without becoming overly self-centered. Your journey involves stepping out of your comfort zone and facing challenges head-on, which ultimately leads to a greater sense of empowerment and self-awareness. While your natural inclination may be to seek harmony and avoid conflict, embracing the assertive and dynamic qualities of Aries will help you achieve your true potential. Your path is about discovering your own power and using it to make a positive impact on the world."
    },
    {
        sign: "Taurus",
        planet: "North Node",
        meaning: "With the North Node in Taurus, your soul's journey involves embracing stability, security, and a deep appreciation for the material aspects of life. You are learning to cultivate patience, persistence, and a practical approach to achieving your goals. This lifetime is about building a solid foundation and creating a life of comfort and abundance. You are encouraged to move away from tendencies towards chaos and instability, and instead, focus on developing a grounded and reliable presence. In relationships, you are learning to value loyalty and consistency, seeking partners who share your appreciation for stability and security. Your journey involves finding balance between material desires and spiritual growth, understanding that true contentment comes from a harmonious integration of both. While your natural inclination may be towards impulsiveness and unpredictability, embracing the steady and practical qualities of Taurus will help you achieve your true potential. Your path is about discovering the beauty and value of the physical world, and using your resources wisely to create a life of lasting fulfillment and peace."
    },
    {
        sign: "Gemini",
        planet: "North Node",
        meaning: "The North Node in Gemini suggests that your soul's journey involves embracing communication, curiosity, and adaptability. You are learning to develop your intellectual abilities and engage with the world through exploration and exchange of ideas. This lifetime is about becoming a versatile thinker and a skilled communicator, using your words to connect with others and share knowledge. You are encouraged to move away from a tendency towards dogmatism and narrow-mindedness, and instead, cultivate an open-minded and inquisitive approach to life. In relationships, you are learning to appreciate the value of communication and intellectual stimulation, seeking partners who can engage you in lively discussions and broaden your horizons. Your journey involves balancing your need for variety and new experiences with a commitment to clear and honest communication. While your natural inclination may be towards rigid beliefs and stubbornness, embracing the flexible and curious qualities of Gemini will help you achieve your true potential. Your path is about discovering the power of words and ideas, and using them to create meaningful connections and foster understanding in the world."
    },
    {
        sign: "Cancer",
        planet: "North Node",
        meaning: "When the North Node is in Cancer, your soul's journey is about embracing emotional sensitivity, nurturing, and creating a sense of belonging. You are learning to connect with your inner feelings and develop a deep sense of empathy and compassion for others. This lifetime is about creating a supportive and caring environment for yourself and those around you. You are encouraged to move away from a tendency towards emotional detachment and self-sufficiency, and instead, focus on building strong emotional bonds and a sense of community. In relationships, you are learning to value emotional intimacy and vulnerability, seeking partners who appreciate your nurturing nature and can provide the emotional support you need. Your journey involves finding balance between caring for others and taking care of your own emotional needs. While your natural inclination may be towards independence and self-reliance, embracing the nurturing and compassionate qualities of Cancer will help you achieve your true potential. Your path is about discovering the importance of emotional connections and using your empathy to create a loving and supportive environment for yourself and others."
    },
    {
        sign: "Leo",
        planet: "North Node",
        meaning: "With the North Node in Leo, your soul's journey involves embracing creativity, self-expression, and the desire to shine. You are learning to develop your unique talents and confidently share them with the world. This lifetime is about stepping into the spotlight and taking pride in your individuality and creative abilities. You are encouraged to move away from tendencies towards humility and self-effacement, and instead, focus on cultivating a strong sense of self-worth and confidence. In relationships, you are learning to value admiration and appreciation, seeking partners who recognize and celebrate your uniqueness. Your journey involves balancing your need for recognition with a genuine interest in others, understanding that true fulfillment comes from both giving and receiving love. While your natural inclination may be towards modesty and self-restraint, embracing the bold and expressive qualities of Leo will help you achieve your true potential. Your path is about discovering the joy of creative self-expression and using your talents to inspire and uplift those around you."
    },
    {
        sign: "Virgo",
        planet: "North Node",
        meaning: "Having the North Node in Virgo means your soul's journey is about developing practicality, organization, and a sense of duty. You are learning to cultivate a disciplined and methodical approach to life, focusing on details and striving for excellence in your endeavors. This lifetime is about being of service to others and finding fulfillment through helping and improving the lives of those around you. You are encouraged to move away from tendencies towards chaos and disorganization, and instead, focus on creating order and efficiency in your environment. In relationships, you are learning to value reliability and practicality, seeking partners who appreciate your dedication and attention to detail. Your journey involves finding balance between serving others and taking care of your own needs, understanding that true fulfillment comes from a harmonious integration of both. While your natural inclination may be towards idealism and escapism, embracing the practical and detail-oriented qualities of Virgo will help you achieve your true potential. Your path is about discovering the importance of service and using your skills to create a positive impact on the world."
    },
    {
        sign: "Libra",
        planet: "North Node",
        meaning: "The North Node in Libra suggests that your soul's journey involves embracing balance, harmony, and relationships. You are learning to develop diplomacy and a cooperative approach to life, focusing on creating harmony in your interactions with others. This lifetime is about understanding the value of partnerships and working collaboratively to achieve your goals. You are encouraged to move away from a tendency towards independence and self-centeredness, and instead, focus on building meaningful and balanced relationships. In relationships, you are learning to appreciate the importance of compromise and mutual support, seeking partners who can provide balance and harmony in your life. Your journey involves finding balance between your own needs and the needs of others, understanding that true fulfillment comes from a harmonious integration of both. While your natural inclination may be towards self-reliance and autonomy, embracing the cooperative and diplomatic qualities of Libra will help you achieve your true potential. Your path is about discovering the beauty of relationships and using your diplomacy to create a more harmonious world."
    },
    {
        sign: "Scorpio",
        planet: "North Node",
        meaning: "With the North Node in Scorpio, your soul's journey involves embracing transformation, depth, and the exploration of the unknown. You are learning to develop a deep understanding of the complexities of life and the power of emotional and psychological transformation. This lifetime is about facing your fears and embracing the process of change and rebirth. You are encouraged to move away from tendencies towards superficiality and materialism, and instead, focus on exploring the deeper aspects of your psyche and the mysteries of life. In relationships, you are learning to value emotional intensity and intimacy, seeking partners who can engage with you on a profound level. Your journey involves finding balance between the material and the spiritual, understanding that true fulfillment comes from a harmonious integration of both. While your natural inclination may be towards comfort and security, embracing the transformative and intense qualities of Scorpio will help you achieve your true potential. Your path is about discovering the power of transformation and using it to create a deeper and more meaningful life."
    },
    {
        sign: "Sagittarius",
        planet: "North Node",
        meaning: "The North Node in Sagittarius suggests that your soul's journey involves embracing adventure, truth, and the pursuit of higher knowledge. You are learning to develop a broad-minded and philosophical approach to life, focusing on expanding your horizons and seeking out new experiences. This lifetime is about exploring different cultures, belief systems, and ways of thinking, and finding your own truth in the process. You are encouraged to move away from tendencies towards narrow-mindedness and rigid beliefs, and instead, cultivate an open-minded and adventurous spirit. In relationships, you are learning to value intellectual stimulation and shared experiences, seeking partners who can accompany you on your journey of discovery. Your journey involves finding balance between your need for freedom and your responsibilities, understanding that true fulfillment comes from a harmonious integration of both. While your natural inclination may be towards familiarity and routine, embracing the adventurous and philosophical qualities of Sagittarius will help you achieve your true potential. Your path is about discovering the joy of exploration and using your wisdom to inspire and guide others."
    },
    {
        sign: "Capricorn",
        planet: "North Node",
        meaning: "With the North Node in Capricorn, your soul's journey involves embracing responsibility, ambition, and the pursuit of long-term goals. You are learning to develop a disciplined and strategic approach to life, focusing on achieving success and building a solid foundation for the future. This lifetime is about taking on leadership roles and cultivating a sense of purpose and direction. You are encouraged to move away from tendencies towards emotional dependency and complacency, and instead, focus on developing self-discipline and a strong work ethic. In relationships, you are learning to value stability and reliability, seeking partners who share your commitment to long-term success and mutual growth. Your journey involves finding balance between your professional ambitions and your personal life, understanding that true fulfillment comes from a harmonious integration of both. While your natural inclination may be towards comfort and emotional security, embracing the disciplined and goal-oriented qualities of Capricorn will help you achieve your true potential. Your path is about discovering the power of perseverance and using it to achieve your aspirations and make a positive impact on the world."
    },
    {
        sign: "Aquarius",
        planet: "North Node",
        meaning: "Having the North Node in Aquarius means your soul's journey is about embracing innovation, individuality, and the pursuit of humanitarian ideals. You are learning to develop a progressive and forward-thinking approach to life, focusing on creating positive change and contributing to the greater good. This lifetime is about stepping outside of conventional norms and embracing your unique perspective and talents. You are encouraged to move away from tendencies towards self-centeredness and rigid thinking, and instead, cultivate an open-minded and inclusive attitude. In relationships, you are learning to value intellectual connection and shared ideals, seeking partners who support your vision for a better future. Your journey involves finding balance between your personal desires and your commitment to the collective, understanding that true fulfillment comes from a harmonious integration of both. While your natural inclination may be towards tradition and conformity, embracing the innovative and humanitarian qualities of Aquarius will help you achieve your true potential. Your path is about discovering the power of individuality and using it to create a more progressive and equitable world."
    },
    {
        sign: "Pisces",
        planet: "North Node",
        meaning: "The North Node in Pisces indicates that your soul's journey involves embracing compassion, intuition, and spiritual growth. You are learning to develop a deep sense of empathy and a connection to the spiritual dimensions of life. This lifetime is about letting go of rigid boundaries and control, and instead, cultivating a sense of trust and surrender to the flow of life. You are encouraged to move away from tendencies towards criticism and perfectionism, and instead, focus on developing a compassionate and forgiving attitude. In relationships, you are learning to value emotional connection and spiritual bonding, seeking partners who share your sensitivity and intuitive understanding. Your journey involves finding balance between the material and the spiritual, understanding that true fulfillment comes from a harmonious integration of both. While your natural inclination may be towards practicality and control, embracing the compassionate and intuitive qualities of Pisces will help you achieve your true potential. Your path is about discovering the power of empathy and using it to create a more loving and spiritually fulfilling life."
    }
];

// Insert the data into the database
const insertData = async () => {
    await connectToDb();

    try {
        await PlanetarySign.insertMany(signData);
        console.log("Data inserted successfully");
    } catch (error) {
        console.error("Error inserting data: ", error);
    } finally {
        mongoose.connection.close();
    }
};

insertData();
