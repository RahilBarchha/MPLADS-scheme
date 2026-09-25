const DataStore = require('../repositories/dataStore');

class AuthController {
    /**
     * Authenticate officer with email / officerId and password
     */
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Official Gov Email / Officer ID and Password are required."
                });
            }

            const officer = DataStore.authenticateOfficer(email, password);
            if (!officer) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid official credentials. Please verify your registered email and password."
                });
            }

            // Generate session token
            const sessionToken = `MPLADS-AUTH-${Buffer.from(officer.id + ':' + Date.now()).toString('base64')}`;

            return res.json({
                success: true,
                message: `Welcome back, ${officer.name}. Authentication verified.`,
                token: sessionToken,
                user: officer
            });
        } catch (error) {
            console.error('[AuthController.login]', error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Register a new member / successor upon resignation or transfer
     */
    static async register(req, res) {
        try {
            const {
                name,
                email,
                role,
                district,
                password,
                officerId,
                contact,
                joiningOrder,
                successionType,
                state
            } = req.body;

            if (!name || !email || !role || !district || !password) {
                return res.status(400).json({
                    success: false,
                    message: "Name, official email, role, district, and password are required fields."
                });
            }

            if (password.length < 6) {
                return res.status(400).json({
                    success: false,
                    message: "Security requirement: Password must be at least 6 characters long."
                });
            }

            const result = DataStore.registerOfficer({
                name,
                email,
                role,
                district,
                state,
                password,
                officerId,
                contact,
                joiningOrder,
                successionType: successionType || 'resignation'
            });

            const sessionToken = `MPLADS-AUTH-${Buffer.from(result.officer.id + ':' + Date.now()).toString('base64')}`;

            let successMessage = `Officer ${result.officer.name} registered successfully for ${result.officer.district}.`;
            if (result.relievedPredecessor) {
                successMessage += ` Former incumbent (${result.relievedPredecessor.name}) has been formally relieved in accordance with official cadre succession.`;
            }

            return res.status(201).json({
                success: true,
                message: successMessage,
                token: sessionToken,
                user: result.officer,
                succession: result.relievedPredecessor
            });
        } catch (error) {
            console.error('[AuthController.register]', error);
            return res.status(400).json({ success: false, message: error.message });
        }
    }

    /**
     * Return public Directory of Officers across all districts (Credentials Excluded)
     */
    static async getOfficers(req, res) {
        try {
            const includeRelieved = req.query.includeRelieved === 'true';
            const district = req.query.district;
            let officers = DataStore.getOfficers(includeRelieved);

            if (district) {
                officers = officers.filter(o => o.district.toLowerCase() === district.toLowerCase());
            }

            return res.json({
                success: true,
                count: officers.length,
                data: officers
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }

    /**
     * Return districts with their active 4 role incumbents
     */
    static async getDistrictsWithRoster(req, res) {
        try {
            const districts = DataStore.getDistricts();
            const activeOfficers = DataStore.getOfficers(false);

            const roster = districts.map(district => {
                const districtOfficers = activeOfficers.filter(o => o.district.toLowerCase() === district.toLowerCase());
                return {
                    district,
                    roles: {
                        dm: districtOfficers.find(o => o.roleCode === 'DM') || null,
                        mp: districtOfficers.find(o => o.roleCode === 'MP') || null,
                        ee: districtOfficers.find(o => o.roleCode === 'EE') || null,
                        dpo: districtOfficers.find(o => o.roleCode === 'DPO') || null
                    }
                };
            });

            return res.json({
                success: true,
                data: roster
            });
        } catch (error) {
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}

module.exports = AuthController;
