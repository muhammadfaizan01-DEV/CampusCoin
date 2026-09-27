<?php
/**
 * CampusCoin PHP Backend REST API Handler
 * Theme: NextGen BudgetBee | Category: End-to-End Web Solutions
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Content-Type: application/json; charset=UTF-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$db_file = __DIR__ . '/database.json';

// Helper to load DB
function load_db($file) {
    if (!file_exists($file)) {
        $initial_data = [
            'users' => [
                [
                    'id' => 'user_alex',
                    'name' => 'Alex Rivera',
                    'email' => 'alex@campus.edu',
                    'password' => 'password123',
                    'role' => 'student',
                    'academic_year' => 'Junior (Computer Science B.S. \'27)',
                    'monthly_allowance_baseline' => 680.00,
                    'savings_goal' => 180.00,
                    'avatar' => 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
                    'created_at' => date('c')
                ],
                [
                    'id' => 'user_admin',
                    'name' => 'Campus Financial Admin',
                    'email' => 'admin@campuscoin.com',
                    'password' => 'admin123',
                    'role' => 'admin',
                    'academic_year' => 'Student Affairs Office',
                    'monthly_allowance_baseline' => 0,
                    'savings_goal' => 0,
                    'avatar' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=250&q=80',
                    'created_at' => date('c')
                ]
            ],
            'categories' => [
                ['id' => 'inc_1', 'name' => 'Allowance', 'type' => 'income', 'is_default' => true, 'icon' => 'Wallet', 'color' => '#10b981'],
                ['id' => 'inc_2', 'name' => 'Part-time Job', 'type' => 'income', 'is_default' => true, 'icon' => 'Briefcase', 'color' => '#06b6d4'],
                ['id' => 'inc_3', 'name' => 'Scholarship', 'type' => 'income', 'is_default' => true, 'icon' => 'GraduationCap', 'color' => '#8b5cf6'],
                ['id' => 'inc_4', 'name' => 'Gift & Cash', 'type' => 'income', 'is_default' => true, 'icon' => 'Gift', 'color' => '#ec4899'],
                ['id' => 'inc_5', 'name' => 'Other Income', 'type' => 'income', 'is_default' => true, 'icon' => 'Coins', 'color' => '#f59e0b'],
                ['id' => 'exp_1', 'name' => 'Food & Dining', 'type' => 'expense', 'is_default' => true, 'icon' => 'Utensils', 'color' => '#ef4444'],
                ['id' => 'exp_2', 'name' => 'Campus Transport', 'type' => 'expense', 'is_default' => true, 'icon' => 'Bus', 'color' => '#06b6d4'],
                ['id' => 'exp_3', 'name' => 'Dorm & Rent', 'type' => 'expense', 'is_default' => true, 'icon' => 'Home', 'color' => '#3b82f6'],
                ['id' => 'exp_4', 'name' => 'Academics & Books', 'type' => 'expense', 'is_default' => true, 'icon' => 'BookOpen', 'color' => '#8b5cf6'],
                ['id' => 'exp_5', 'name' => 'Digital Subscriptions', 'type' => 'expense', 'is_default' => true, 'icon' => 'Tv', 'color' => '#a855f7'],
                ['id' => 'exp_6', 'name' => 'Social & Outings', 'type' => 'expense', 'is_default' => true, 'icon' => 'Film', 'color' => '#f59e0b'],
                ['id' => 'exp_7', 'name' => 'Miscellaneous', 'type' => 'expense', 'is_default' => true, 'icon' => 'Package', 'color' => '#64748b']
            ],
            'transactions' => [
                ['id' => 'tx_1', 'user_id' => 'user_alex', 'category_id' => 'inc_1', 'type' => 'income', 'amount' => 550.00, 'description' => 'Monthly Family Allowance', 'date' => date('Y-m-d', strtotime('-2 days')), 'recurring' => true],
                ['id' => 'tx_2', 'user_id' => 'user_alex', 'category_id' => 'inc_2', 'type' => 'income', 'amount' => 240.00, 'description' => 'CS Lab Peer Tutor Stipend', 'date' => date('Y-m-d', strtotime('-8 days')), 'recurring' => false],
                ['id' => 'tx_3', 'user_id' => 'user_alex', 'category_id' => 'exp_1', 'type' => 'expense', 'amount' => 38.50, 'description' => 'Campus Center Cafe & Grill', 'date' => date('Y-m-d', strtotime('-1 days')), 'recurring' => false],
                ['id' => 'tx_4', 'user_id' => 'user_alex', 'category_id' => 'exp_1', 'type' => 'expense', 'amount' => 92.40, 'description' => 'Weekly Groceries at Trader Joe\'s', 'date' => date('Y-m-d', strtotime('-3 days')), 'recurring' => false],
                ['id' => 'tx_5', 'user_id' => 'user_alex', 'category_id' => 'exp_3', 'type' => 'expense', 'amount' => 260.00, 'description' => 'Quad Dorm Room Rent Share', 'date' => date('Y-m-d', strtotime('-1 days')), 'recurring' => true]
            ],
            'budgets' => [
                ['id' => 'b_1', 'user_id' => 'user_alex', 'category_id' => 'exp_1', 'limit_amount' => 200.00],
                ['id' => 'b_2', 'user_id' => 'user_alex', 'category_id' => 'exp_2', 'limit_amount' => 50.00],
                ['id' => 'b_3', 'user_id' => 'user_alex', 'category_id' => 'exp_3', 'limit_amount' => 260.00]
            ]
        ];
        file_put_contents($file, json_encode($initial_data, JSON_PRETTY_PRINT));
        return $initial_data;
    }
    return json_decode(file_get_contents($file), true);
}

function save_db($file, $data) {
    file_put_contents($file, json_encode($data, JSON_PRETTY_PRINT));
}

$db = load_db($db_file);
$action = $_GET['action'] ?? '';
$input = json_decode(file_get_contents('php://input'), true);

switch ($action) {
    case 'login':
        $email = strtolower($input['email'] ?? '');
        $password = $input['password'] ?? '';
        foreach ($db['users'] as $user) {
            if (strtolower($user['email']) === $email && $user['password'] === $password) {
                echo json_encode(['success' => true, 'user' => $user]);
                exit();
            }
        }
        http_response_code(401);
        echo json_encode(['error' => 'Invalid email address or password.']);
        break;

    case 'transactions':
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $newTx = array_merge($input, [
                'id' => 'tx_' . time(),
                'created_at' => date('c')
            ]);
            array_unshift($db['transactions'], $newTx);
            save_db($db_file, $db);
            echo json_encode($newTx);
        } else {
            echo json_encode($db['transactions']);
        }
        break;

    case 'categories':
        echo json_encode($db['categories']);
        break;

    case 'budgets':
        echo json_encode($db['budgets']);
        break;

    default:
        echo json_encode(['status' => 'ok', 'backend' => 'PHP REST API Server v1.0', 'timestamp' => date('c')]);
        break;
}
